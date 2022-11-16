<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxGroupItem :col-count="2">
				<DxSimpleItem
					data-field="name"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.name')" />
					<DxRequiredRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="organizationType"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="organizationTypeOptions"
				>
					<DxLabel :text="$t('labels.organizationType')" />
					<DxRequiredRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="departmentCode"
					data-type="number"
					editor-type="dxNumberBox"
					:editor-options="departmentCodeOptions"
				>
					<DxLabel :text="$t('labels.departmentCode')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="branchCode"
					data-type="number"
					editor-type="dxNumberBox"
					:editor-options="branchCodeOptions"
				>
					<DxLabel :text="$t('labels.branchCode')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="regionId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="regionOptions"
				>
					<DxLabel :text="$t('labels.region')" />
					<DxRequiredRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="districtsId"
					data-type="array"
					template="districtsTagBox"
				>
					<DxLabel :text="$t('labels.districts')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="parentId"
					data-type="number"
					template="organizationSelectBox"
				>
					<DxLabel :text="$t('labels.parent')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="status"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="statusOptions"
				>
					<DxLabel :text="$t('labels.status')" />
					<DxRequiredRule :message="$t('notifications.required.status')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #organizationSelectBox>
				<OrganizationSelectBox
					:value="formData.parentId"
					@valueChanged="value => (formData.parentId = value)"
				/>
			</template>
			<template #districtsTagBox>
				<DistrictTagBox
					:value="formData.districtsId"
					:filter="districtFilter"
					:readOnly="formData.regionId === null"
					@valueChanged="value => (formData.districtsId = value)"
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

import BaseToolbar from "~/components/page/base-toolbar.vue";
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";
import DistrictTagBox from "~/components/administration/district/district-tag-box/index.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { Organization } from "~/infrastructure/classes/administration/Organization";
import { IOrganization } from "~/infrastructure/interfaces/administration/IOrganization";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { OrganizationTypes } from "~/infrastructure/data-sources/OrganizationTypes";
import { OrganizationType } from "~/infrastructure/enums/OrganizationType";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxAsyncRule,
		DxButtonItem,
		BaseToolbar,
		OrganizationSelectBox,
		DistrictTagBox
	},
	data() {
		let formData: IOrganization = new Organization();
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"Organization"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"Organization"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"Organization"
			];
			return PermissionControler.fullAccess(permission);
		},
		districtFilter() {
			return ["regionId", "=", this.formData.regionId];
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		branchCodeOptions() {
			return new NumberBoxProperties({
				readOnly: this.formData.organizationType !== OrganizationType.Branch
			});
		},
		departmentCodeOptions() {
			return new NumberBoxProperties({
				readOnly: this.formData.organizationType !== OrganizationType.Department
			});
		},
		regionOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.region,
				onValueChanged: () => {
					this.formData.districtsId.length = 0;
				}
			});
		},
		districtsOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.district
			});
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		},
		organizationTypeOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: OrganizationTypes(this),
				onValueChanged: () => {
					this.formData.branchCode = null;
					this.formData.departmentCode = null;
				}
			});
		}
	},
	methods: {
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.organization, this.formData),
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