<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="saveStamp" />

		<DxForm ref="form" :form-data.sync="stamp">
			<DxSimpleItem
				data-field="organizationId"
				data-type="number"
				template="organizationSelectBox"
			>
				<DxRequiredRule />
				<DxLabel :text="$t('labels.stamp.organizationId')" />
			</DxSimpleItem>
			<DxSimpleItem
				data-field="userId"
				data-type="number"
				editor-type="dxSelectBox"
				:editor-options="userIdOptions"
			>
				<DxRequiredRule />
				<DxLabel :text="$t('labels.stamp.userId')" />
			</DxSimpleItem>
			<DxSimpleItem
				data-field="number"
				data-type="number"
				editor-type="dxNumberBox"
				:editor-options="numberBoxOptions"
			>
				<DxRequiredRule />
				<DxLabel :text="$t('labels.stamp.number')" />
			</DxSimpleItem>
			<template #organizationSelectBox>
				<OrganizationSelectBox
					:value="stamp.organizationId"
					@valueChanged="value => (stamp.organizationId = value)"
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import DxTagBox from "devextreme-vue/tag-box";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";

import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { Stamp } from "~/infrastructure/classes/Stamp";
import { IStamp } from "~/infrastructure/interfaces/IStamp";
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
		BaseToolbar,
		OrganizationSelectBox
	},
	data() {
		let stamp: IStamp = new Stamp();
		return {
			stamp
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Stamp"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Stamp"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Stamp"];
			return PermissionControler.fullAccess(permission);
		},
		numberBoxOptions() {
			return new NumberBoxProperties({
				disabled: !this.stamp.organizationId
			});
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		organizationIdOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.organization,
				key: "id",
				valueExpr: "id",
				displayExpr: "name"
			});
		},
		userIdOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: `${this.$dataApi.userStamp}/${this.stamp.organizationId}`,
				key: "id",
				valueExpr: "id",
				displayExpr: "fullName",
				disabled: !this.stamp.organizationId
			});
		}
	},
	methods: {
		saveStamp() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.stamp, this.stamp),
					e => {
						this.$awn.success();
						this.$router.push(`/agency/stamps`);
					},
					e => {
						this.$awn.alert();
					}
				);
			}
		}
	},
});
</script>