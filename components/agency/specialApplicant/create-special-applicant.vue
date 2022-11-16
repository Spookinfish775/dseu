<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="saveSpecialApplicant" />
		<DxForm ref="form" label-location="top" :form-data="employee">
			<DxGroupItem :col-count="2" :caption="$t('labels.generalInformation')">
				<DxSimpleItem
					data-field="fullInformation"
					data-type="string"
					editor-type="dxTextBox"
					><DxLabel
						:text="$t('navigation.agency.specialApplicantFullInformation')"
					/>
				</DxSimpleItem>
				<DxSimpleItem
					data-field="identityDocumentName"
					data-type="string"
					editor-type="dxTextBox"
				>
					<DxLabel
						:text="$t('navigation.agency.specialApplicantIdentityDocumentName')"
					/>
					<DxRequiredRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="identityDocumentNumber"
					data-type="string"
					editor-type="dxTextBox"
				>
					<DxLabel
						:text="
							$t('navigation.agency.specialApplicantIdentityDocumentNumber')
						"
					/>
					<DxRequiredRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="identityDocumentIssueDate"
					data-type="date"
					editor-type="dxDateBox"
					><DxLabel
						:text="
							$t('navigation.agency.specialApplicantIdentityDocumentIssueDate')
						"
					/>
					<DxRequiredRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="identityDocumentIssuedBy"
					data-type="string"
					editor-type="dxTextBox"
					><DxLabel
						:text="
							$t('navigation.agency.specialApplicantIdentityDocumentIssuedBy')
						"
					/>
				</DxSimpleItem>
				<DxSimpleItem
					data-field="specialApplicantTypeId"
					editor-type="dxSelectBox"
					data-type="number"
					:editor-options="specialApplicantTypeOptions"
				>
					<DxLabel :text="$t('navigation.agency.specialApplicantTypeId')" />
					<DxRequiredRule />
				</DxSimpleItem>
			</DxGroupItem>
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import DxTagBox from "devextreme-vue/tag-box";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxButtonItem,
		DxTagBox,
		DxTextArea,
		BaseToolbar
	},
	data() {
		return {
			employee: {
				fullInformation: "",
				identityDocumentName: "",
				identityDocumentNumber: "",
				identityDocumentIssueDate: null,
				identityDocumentIssuedBy: "",
				specialApplicantTypeId: null
			}
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"SpecialApplicant"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"SpecialApplicant"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"SpecialApplicant"
			];
			return PermissionControler.fullAccess(permission);
		},
		specialApplicantTypeOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.specialApplicantType
			});
		}
	},
	methods: {
		saveSpecialApplicant() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.specialApplicant, this.employee),
					e => {
						this.$awn.success();
						this.$emit("successedSave", e.data);
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

<style lang="scss">
</style> 