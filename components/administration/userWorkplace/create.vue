<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxGroupItem :col-count="2" :caption="$t('labels.generalInformation')">
				<DxSimpleItem
					data-field="userId"
					data-type="string"
					editor-type="dxSelectBox"
					:editor-options="userSelectBox"
				>
					<DxLabel :text="$t('labels.user')" />
					<DxRequiredRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="jobTitleId"
					data-type="number"
					template="jobTitleSelectBox"
				>
					<DxLabel :text="$t('labels.jobTitle')" />
					<DxRequiredRule :message="$t('notifications.required.jobTitle')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="organizationId"
					data-type="number"
					template="organizationSelectBox"
				>
					<DxLabel :text="$t('labels.workplace')" />
					<DxRequiredRule :message="$t('notifications.required.workplace')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="isMainWorkPlace"
					data-type="boolean"
					editor-type="dxCheckBox"
				>
					<DxLabel location="left" :text="$t('labels.mainWorkPlace')" />
					<DxRequiredRule />
				</DxSimpleItem>
			</DxGroupItem>
			<DxGroupItem
				:col-count="2"
				:caption="$t('labels.employmentWorkplaceOrder')"
			>
				<DxSimpleItem
					data-field="employmentWorkplaceOrder.name"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.name')" />
					<DxRequiredRule :message="$t('notifications.required.name')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="employmentWorkplaceOrder.number"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.number')" />
					<DxRequiredRule :message="$t('notifications.required.number')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="employmentWorkplaceOrder.issuer"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.issuer')" />
					<DxRequiredRule :message="$t('notifications.required.issuer')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="employmentWorkplaceOrder.fullInformation"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.fullInformation')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="employmentWorkplaceOrder.issueDataTime"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="issueDataTimeOptions"
				>
					<DxLabel :text="$t('labels.issueDataTime')" />
					<DxRequiredRule
						:message="$t('notifications.required.issueDataTime')"
					/>
				</DxSimpleItem>
				<DxSimpleItem
					data-field="employmentWorkplaceOrder.note"
					data-type="string"
					editor-type="dxTextArea"
					:col-span="2"
					:editor-options="textAreaOptions"
				>
					<DxLabel :text="$t('labels.note')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #jobTitleSelectBox>
				<JobTitleSelectBox
					:value="formData.jobTitleId"
					@valueChanged="jobTitleChanged"
				/>
			</template>
			<template #organizationSelectBox>
				<OrganizationSelectBox
					:value="formData.organizationId"
					@valueChanged="organizationChanged"
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import JobTitleSelectBox from "~/components/administration/jobTitles/jobTitles-select-box.vue";
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { UserWorkplace } from "~/infrastructure/classes/administration/UserWorkplace";
import { IUserWorkplace } from "~/infrastructure/interfaces/administration/IUserWorkplace";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		BaseToolbar,
		JobTitleSelectBox,
		OrganizationSelectBox,
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxAsyncRule,
		DxButtonItem,
		DxTextArea
	},
	data() {
		let formData: IUserWorkplace = new UserWorkplace();
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"UserWorkplace"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"UserWorkplace"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"UserWorkplace"
			];
			return PermissionControler.fullAccess(permission);
		},
		userSelectBox() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.user,
				filter: ["fullName", "<>", "Administrator"],
				displayExpr: "fullName",
				searchExpr: "fullName"
			});
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		issueDataTimeOptions() {
			return new DateBoxProperties();
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		}
	},
	methods: {
		jobTitleChanged(data) {
			this.formData.jobTitleId = data;
		},
		organizationChanged(data) {
			this.formData.organizationId = data;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.userWorkplace, this.formData),
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