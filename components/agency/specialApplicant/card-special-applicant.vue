<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="saveData"
			@delete="deleteData"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data="formData"
		>
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
import { confirm } from "devextreme/ui/dialog";

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
		let formData = this.data;
		return {
			formData
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
		saveData() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.specialApplicant}/${this.formData.id}`,
						this.formData
					),
					e => {
						this.$awn.success();
						this.$emit("successedSave", e.data);
						this.$router.push(`/agency/specialApplicant`);
					},
					e => {
						this.$awn.alert();
					}
				);
			}
		},
		deleteData() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(
							`${this.$dataApi.specialApplicant}/${this.formData.id}`
						),
						e => {
							this.$awn.success();
							this.$emit("successedDeleted");
							this.$router.push(`/agency/specialApplicant`);
						},
						e => {
							this.$awn.allert();
						}
					);
				}
			});
		}
	}
});
</script>