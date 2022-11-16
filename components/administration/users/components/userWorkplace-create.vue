<template>
	<div>
		<BaseToolbar :canSave="true" @save="saveUserWorkplace" />
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="userWorkplace"
			:col-count="2"
		>
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

			<template #jobTitleSelectBox>
				<JobTitleSelectBox
					:value="userWorkplace.jobTitleId"
					@valueChanged="jobTitleChanged"
				/>
			</template>
			<template #organizationSelectBox>
				<OrganizationSelectBox
					:value="userWorkplace.organizationId"
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
	props: {
		userId: {
			type: String,
			required: true
		},
    
	},
	data() {
		return {
			userWorkplace: {
				userId: this.userId,
				organizationId: null,
				jobTitleId: null
			}
		};
	},
	methods: {
		jobTitleChanged(data) {
			this.userWorkplace.jobTitleId = data;
		},
		organizationChanged(data) {
			this.userWorkplace.organizationId = data;
		},
		saveUserWorkplace() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.userWorkplace, this.userWorkplace),
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