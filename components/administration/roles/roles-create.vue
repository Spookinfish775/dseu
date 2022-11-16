<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="saveRole" />
		<DxForm ref="form" label-location="top" :form-data.sync="role">
			<DxSimpleItem
				data-field="name"
				data-type="string"
				editor-type="dxTextBox"
				:editor-options="textBoxOptions"
			>
				<DxLabel :text="$t('labels.name')" />
				<DxRequiredRule :message="$t('notifications.required.name')" />
			</DxSimpleItem>

			<DxSimpleItem data-field="samples" template="claimsGrid">
				<DxLabel :text="$t('labels.claims')" />
			</DxSimpleItem>
			<template #claimsGrid>
				<ClaimsGrid @valueChanged="claimsChanged" />
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
	DxRequiredRule
} from "devextreme-vue/form";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ClaimsGrid from "./claims-grid.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { Role } from "~/infrastructure/classes/administration/Role";
import { IRole } from "~/infrastructure/interfaces/administration/IRole";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		BaseToolbar,
		ClaimsGrid,
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule
	},
	data() {
		let role: IRole = new Role();
		return {
			role
		};
	},
	computed: {
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Role"];
			return PermissionControler.canUpdate(permission);
		},
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Role"];
			return PermissionControler.canCreate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Role"];
			return PermissionControler.fullAccess(permission);
		},
		textBoxOptions() {
			return new TextBoxProperties();
		}
	},
	methods: {
		claimsChanged(data) {
			this.role.claims = data;
		},
		saveRole() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.role, this.role),
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