<template>
	<div class="card-wrapper">
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canCreate"
			:canDelete="canUpdate"
			@save="onSave"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="formData"
		>
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
				data-field="officialDocuments"
				template="officialDocumentsList"
			>
				<DxLabel :text="$t('labels.officialDocuments')" />
			</DxSimpleItem>

			<template #officialDocumentsList>
				<AcceptedDocumentsList
					:data="formData.officialDocuments"
					@valueChanged="acceptedDocumentsChanged"
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
import DxTextArea from "devextreme-vue/text-area";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";

import { Booleans } from "~/infrastructure/data-sources/Booleans";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IEncumbranceRelease } from "~/infrastructure/interfaces/agency/services/IEncumbranceRelease";
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
		DxTextArea,
		BaseToolbar,
		ApplicantsDataGrid,
		AcceptedDocumentsDataGrid,
		AcceptedDocumentsList
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
		let formData: IEncumbranceRelease = this.data;
		return {
			formData,
			booleanDataSource: Booleans(this)
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceRelease"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceRelease"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceRelease"
			];
			return PermissionControler.fullAccess(permission);
		},
		encumbranceLetterOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.encumbranceLetter,
				filter: ["isReleased", "=", false],
				displayExpr: "id"
			});
		},
		enteredDateOptions() {
			return new DateBoxProperties({
				readOnly: true
			});
		}
	},
	methods: {
		acceptedDocumentsChanged(data) {
			this.formData.acceptedDocuments = data;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.encumbranceRelease}/${this.formData.id}`,
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
							`${this.$dataApi.encumbranceRelease}/${this.formData.id}`
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