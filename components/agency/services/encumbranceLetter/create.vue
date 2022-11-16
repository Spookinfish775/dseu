<template>
	<div class="card-wrapper">
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
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
				</DxGroupItem>
				<DxSimpleItem
					data-field="officialDocuments"
					template="officialDocumentsList"
				>
					<DxLabel :text="$t('labels.officialDocuments')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #officialDocumentsList>
				<AcceptedDocumentsList @valueChanged="officialDocumentsChanged" />
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

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";

import { LawType } from "~/infrastructure/enums/LawType";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { EncumbranceLetter } from "~/infrastructure/classes/agency/services/EncumbranceLetter";
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
	data() {
		let formData: IEncumbranceLetter = new EncumbranceLetter();
		return {
			formData
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
		officialDocumentsChanged(data) {
			this.formData.officialDocuments = data;
		},
		realEstateChanged(data) {
			this.formData.realEstateId = data;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.encumbranceLetter, this.formData),
					e => {
						this.$awn.success();
						this.$emit("successedSaved", e.data);
					},
					e => {
						this.$awn.alert();
					}
				);
			}
		}
	}
});
</script>