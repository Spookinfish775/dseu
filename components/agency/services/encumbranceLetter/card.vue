<template>
	<div class="card-wrapper">
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="onSave"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="formData"
		>
			<DxGroupItem :col-count="2">
				<DxGroupItem>
					<DxSimpleItem
						data-field="encumbranceId"
						data-type="number"
						editor-type="dxSelectBox"
						:editor-options="encumbranceOptions"
					>
						<DxLabel :text="$t('labels.encumbrance')" />
						<DxRequiredRule />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="realEstateId"
						data-type="number"
						template="realEstateSelectBox"
					>
						<DxLabel :text="$t('labels.realEstate')" />
						<DxRequiredRule
							:message="$t('notifications.required.realEstate')"
						/>
					</DxSimpleItem>
					<DxSimpleItem
						data-field="applicant"
						data-type="string"
						editor-type="dxTextBox"
						:editor-options="textBoxOptions"
					>
						<DxLabel :text="$t('labels.applicant')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="note"
						data-type="string"
						editor-type="dxTextArea"
						:editor-options="textAreaOptions"
					>
						<DxLabel :text="$t('labels.note')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="enteredDate"
						data-type="date"
						editor-type="dxDateBox"
						:editor-options="enteredDateOptions"
					>
						<DxLabel :text="$t('labels.enteredDate')" />
						<DxRequiredRule />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="isReleased"
						data-type="boolean"
						editor-type="dxCheckBox"
						:editor-options="{ readOnly: true }"
					>
						<DxLabel location="left" :text="$t('labels.isReleased')" />
					</DxSimpleItem>
				</DxGroupItem>
				<DxSimpleItem
					data-field="officialDocuments"
					template="officialDocumentsList"
				>
					<DxLabel :text="$t('labels.officialDocuments')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #officialDocumentsList>
				<AcceptedDocumentsList
					:data="formData.officialDocuments"
					@valueChanged="acceptedDocumentsChanged"
				/>
			</template>
			<template #realEstateSelectBox>
				<RealEstateSelectBox
					:value="formData.realEstateId"
					@valueChanged="realEstateChanged"
				/>
			</template>
		</DxForm>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxForm, {
	DxGroupItem,
	DxSimpleItem,
	DxLabel,
	DxRequiredRule,
	DxEmailRule,
	DxAsyncRule,
	DxPatternRule,
	DxButtonItem
} from "devextreme-vue/form";
import "devextreme-vue/text-area";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";

import { LawType } from "~/infrastructure/enums/LawType";
import { Booleans } from "~/infrastructure/data-sources/Booleans";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { IEncumbranceLetter } from "~/infrastructure/interfaces/agency/services/IEncumbranceLetter";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxPatternRule,
		DxAsyncRule,
		DxButtonItem,
		BaseToolbar,
		ApplicantsDataGrid,
		AcceptedDocumentsDataGrid,
		AcceptedDocumentsList,
		RealEstateSelectBox
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		let formData: IEncumbranceLetter = this.data;
		return {
			formData,
			booleanDataSource: Booleans(this)
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceLetter"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceLetter"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceLetter"
			];
			return PermissionControler.fullAccess(permission);
		},
		enteredDateOptions() {
			return new DateBoxProperties({
				readOnly: true
			});
		},
		realEstateOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.realEstate
			});
		},
		encumbranceOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.law,
				filter: ["lawType", "=", LawType.Encumbrance]
			});
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		textAreaOptions() {
			return new TextAreaProperties();
		}
	},
	methods: {
		acceptedDocumentsChanged(data) {
			this.formData.acceptedDocuments = data;
		},
		realEstateChanged(data) {
			this.formData.realEstateId = data;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.encumbranceLetter}/${this.formData.id}`,
						this.formData
					),
					e => {
						this.$awn.success();
						this.$emit("successedSaved", e.data);
					},
					e => {
						this.$awn.alert();
					}
				);
			}
		},
		onDelete() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(
							`${this.$dataApi.encumbranceLetter}/${this.formData.id}`
						),
						e => {
							this.$awn.success();
							this.$emit("successedDeleted");
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			});
		}
	}
});
</script>