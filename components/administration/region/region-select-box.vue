<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="region"
			:value="value"
			:buttons="buttons"
			:read-only="readOnly"
			:showClearButton="true"
			:search-enabled="true"
			:search-expr="displayExpr"
			@value-changed="valueChanged"
		/>
		<BasePopup
			ref="regionPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.region')"
		>
			<RegionCard
				v-if="isCard"
				:data="selectedValue"
				:readOnly="readOnly"
				@successedSaved="successedSaved"
				@successedDeleted="successedDeleted"
			/>
			<RegionCreate v-else @successedSaved="successedSaved" />
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import RegionCreate from "./region-create.vue";
import RegionCard from "./region-card.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		RegionCreate,
		RegionCard,
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
			region: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.region
				})
			}),
			selectedValue: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Region"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Region"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Region"];
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
									this.$axios.get(`${this.$dataApi.region}/${this.value}`),
									e => {
										this.selectedValue = e.data;
										this.isCard = true;
										this.$refs["regionPopup"].open();
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
							this.$refs["regionPopup"].open();
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
			this.$refs["regionPopup"].close();
			await this.region.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", null);
		},
		async successedSaved(data) {
			this.$refs["regionPopup"].close();
			await this.region.reload();
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