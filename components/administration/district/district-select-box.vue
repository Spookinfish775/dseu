<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="district"
			:value="value"
			:buttons="buttons"
			:read-only="readOnly"
			:showClearButton="true"
			:search-enabled="true"
			:search-expr="displayExpr"
			@value-changed="valueChanged"
		/>
		<BasePopup
			ref="districtPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.district')"
		>
			<DistrictCard
				v-if="isCard"
				:data="selectedValue"
				@successedSaved="successedSaved"
				@successedDeleted="successedDeleted"
			/>
			<DistrictCreate
				v-else
				:regionId="regionId"
				@successedSaved="successedSaved"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import DistrictCreate from "./district-create.vue";
import DistrictCard from "./district-card.vue";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { Status } from "~/infrastructure/enums/Status";

export default Vue.extend({
	components: {
		DistrictCreate,
		DistrictCard,
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
		regionId: {
			type: Number
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isCard: false,
			selectedValue: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["District"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["District"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["District"];
			return PermissionControler.fullAccess(permission);
		},
		district() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.district
				}),
				filter: this.regionId
					? [
							["regionId", "=", this.regionId],
							"and",
							["status", "=", Status.Active]
					  ]
					: null
			});
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
						visible: this.value != null,
						onClick: () => {
							if (this.valueExpr == "id") {
								this.$awn.asyncBlock(
									this.$axios.get(`${this.$dataApi.district}/${this.value}`),
									e => {
										this.selectedValue = e.data;
										this.isCard = true;
										this.$refs["districtPopup"].open();
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
							this.$refs["districtPopup"].open();
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
			this.$refs["districtPopup"].close();
			await this.district.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", null);
		},
		async successedSaved(data) {
			this.$refs["districtPopup"].close();
			await this.district.reload();
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