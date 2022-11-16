<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="role"
			:value="value"
			:buttons="buttons"
			:read-only="readOnly"
			:showClearButton="true"
			:search-enabled="true"
			:search-expr="displayExpr"
			@value-changed="valueChanged"
		/>
		<BasePopup
			ref="rolePopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.role')"
		>
			<RolesCard
				v-if="isCard"
				:data="selectedValue"
				@successedSaved="successedSaved"
				@successedDeleted="successedDeleted"
			/>
			<RolesCreate v-else @successedSaved="successedSaved" />
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import RolesCreate from "./roles-create.vue";
import RolesCard from "./roles-card.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		RolesCreate,
		RolesCard,
		DxSelectBox,
		BasePopup
	},
	props: {
		value: {
			default: null
		},
		valueExpr: {
			type: String,
			default: "id"
		},
		displayExpr: {
			type: String,
			default: "name"
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isCard: false,
			role: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.role
				}),
				filter: ["name", "<>", "Administrator"]
			}),
			selectedValue: null
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
		buttons() {
			return [
				{
					location: "after",
					name: "clear"
				},
				{
					location: "after",
					name: "info",
					options: {
						icon: "info",
						stylingMode: "text",
						disabled: this.value === null,
						visible: this.value !== null,
						onClick: () => {
							if (this.valueExpr == "id") {
								this.$awn.asyncBlock(
									this.$axios.get(`${this.$dataApi.role}/${this.value}`),
									e => {
										this.selectedValue = e.data;
										this.isCard = true;
										this.$refs["rolePopup"].open();
									},
									e => {
										this.$awn.alert();
									}
								);
							}
						}
					}
				},
				{
					location: "after",
					name: "add",
					options: {
						icon: "plus",
						stylingMode: "text",
						visible: this.canCreate && !this.readOnly,
						onClick: () => {
							this.isCard = false;
							this.$refs["rolePopup"].open();
						}
					}
				},
				{
					location: "after",
					name: "dropDown"
				}
			];
		}
	},
	methods: {
		async successedDeleted() {
			this.$refs["rolePopup"].close();
			await this.role.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", null);
		},
		async successedSaved(data) {
			this.$refs["rolePopup"].close();
			await this.role.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data[this.valueExpr]);
		},
		valueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>

<style scoped>
</style>