<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="territorialUnit"
			:value="value"
			:buttons="buttons"
			:read-only="readOnly"
			:showClearButton="true"
			:search-enabled="true"
			:search-expr="displayExpr"
			:open-on-field-click="false"
			@value-changed="valueChanged"
		/>
		<BasePopup
			ref="territorialUnitListPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('navigation.territorialUnit.title')"
		>
			<TerritorialUnitViewTreeList
				:valueExpr="valueExpr"
				@valueSelected="valueSelected"
			/>
		</BasePopup>
		<BasePopup
			ref="territorialUnitPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="popupTitle"
		>
			<TerritorialUnitCard
				v-if="isCard"
				:data="selectedValue"
				:readOnly="readOnly"
				@successedSaved="successedSaved"
				@successedDeleted="successedDeleted"
			/>
			<TerritorialUnitCreate v-else @successedSaved="successedSaved" />
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import TerritorialUnitViewTreeList from "~/components/territorialUnit/territorialUnit-select-box/territorialUnit-view-tree-list.vue";
import TerritorialUnitCreate from "~/components/territorialUnit/territorialUnit-create.vue";
import TerritorialUnitCard from "~/components/territorialUnit/territorialUnit-card.vue";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		TerritorialUnitViewTreeList,
		TerritorialUnitCreate,
		TerritorialUnitCard,
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
			default: "fullAddress"
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isCard: false,
			territorialUnit: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.territorialUnit
				})
			}),
			selectedValue: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"TerritorialUnit"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"TerritorialUnit"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"TerritorialUnit"
			];
			return PermissionControler.fullAccess(permission);
		},
		popupTitle() {
			return this.isCard
				? this.$t("navigation.territorialUnit.title")
				: this.$t("navigation.territorialUnit.createTerritorialUnitTitle");
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
									this.$axios.get(
										`${this.$dataApi.territorialUnit}/${this.value}`
									),
									e => {
										this.selectedValue = e.data;
										this.isCard = true;
										this.$refs["territorialUnitPopup"].open();
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
							this.$refs["territorialUnitPopup"].open();
						}
					}
				},
				{
					location: "after",
					name: "list",
					options: {
						icon: "bulletlist",
						stylingMode: "text",
						visible: !this.readOnly,
						onClick: () => {
							this.$refs["territorialUnitListPopup"].open();
						}
					}
				}
			];
		}
	},
	methods: {
		async successedSaved(data) {
			this.$refs["territorialUnitPopup"].close();
			await this.territorialUnit.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data[this.valueExpr]);
		},
		async successedDeleted() {
			this.$refs["territorialUnitPopup"].close();
			await this.territorialUnit.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", null);
		},
		async valueSelected(data) {
			this.$refs["territorialUnitListPopup"].close();
			await this.territorialUnit.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data);
		},
		valueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>

<style scoped>
</style>