<template>
	<div>
		<BaseToolbar
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="saveRole"
			@delete="deleteRole"
		/>
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
				<ClaimsGrid :data="role.claims" @valueChanged="claimsChanged" />
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
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ClaimsGrid from "./claims-grid.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
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
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		let role: IRole = this.data;
		return {
			role
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Role"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Role"];
			return PermissionControler.canUpdate(permission);
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
					this.$axios.put(`${this.$dataApi.role}/${this.role.id}`, this.role),
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
		deleteRole() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(`${this.$dataApi.role}/${this.role.id}`),
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

<style scoped></style>
