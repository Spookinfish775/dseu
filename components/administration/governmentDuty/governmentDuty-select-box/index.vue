<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="dataSource"
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
			ref="viewDataGridPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('navigation.administration.governmentDutyDataBookEntryTitle')"
			:drag-enabled="false"
			:close-on-outside-click="true"
		>
			<GovernmentDutyViewDataGreed
				:filter="filter"
				@valueSelected="valueSelected"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import BasePopup from "~/components/page/popup.vue";
import DataSource from "devextreme/data/data_source";

import GovernmentDutyViewDataGreed from "./governmentDuty-view-data-grid.vue";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxSelectBox,
		BasePopup,
		GovernmentDutyViewDataGreed
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
		},
		filter: {
			type: Array,
			default: null
		}
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.governmentDuty
				}),
				filter: this.filter
			}),
			applicantType: null,
			selectedValue: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"GovernmentDuty"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"GovernmentDuty"
			];
			return PermissionControler.canUpdate(permission);
		},
		buttons() {
			return [
				{
					location: "after",
					name: "clear"
				},
				{
					location: "after",
					name: "list",
					options: {
						icon: "bulletlist",
						stylingMode: "text",
						visible: !this.readOnly,
						onClick: () => {
							this.$refs.viewDataGridPopup.open();
						}
					}
				}
			];
		}
	},
	methods: {
		async valueSelected(data) {
			this.$refs.viewDataGridPopup.close();
			await this.dataSource.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data);
		},
		valueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>