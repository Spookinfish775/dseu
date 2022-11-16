<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="jobTitle"
			:value="value"
			:buttons="buttons"
			:read-only="readOnly"
			:showClearButton="true"
			:search-enabled="true"
			:search-expr="displayExpr"
			@value-changed="valueChanged"
		/>
		<BasePopup
			ref="jobTitlePopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.jobTitle')"
		>
			<JobTitleCard
				v-if="isCard"
				:data="selectedValue"
				@successedSaved="successedSaved"
				@successedDeleted="successedDeleted"
			/>
			<JobTitleCreate v-else @successedSaved="successedSaved" />
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import JobTitleCreate from "./jobTitles-create.vue";
import JobTitleCard from "./jobTitles-card.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		JobTitleCreate,
		JobTitleCard,
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
			jobTitle: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.jobTitle
				})
			}),
			selectedValue: null
		};
	},
	computed: {
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["JobTitle"];
			return PermissionControler.canUpdate(permission);
		},
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["JobTitle"];
			return PermissionControler.canCreate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["JobTitle"];
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
									this.$axios.get(`${this.$dataApi.jobTitle}/${this.value}`),
									e => {
										this.selectedValue = e.data;
										this.isCard = true;
										this.$refs["jobTitlePopup"].open();
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
						disabled: this.value === null,
						visible: this.canCreate && !this.readOnly,
						onClick: () => {
							this.isCard = false;
							this.$refs["jobTitlePopup"].open();
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
			this.$refs["jobTitlePopup"].close();
			await this.jobTitle.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", null);
		},
		async successedSaved(data) {
			this.$refs["jobTitlePopup"].close();
			await this.jobTitle.reload();
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