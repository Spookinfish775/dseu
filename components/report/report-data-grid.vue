<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="dataSource"
			:show-borders="true"
			:hoverStateEnabled="true"
			:errorRowEnabled="false"
			:hover-state-enabled="true"
			:remote-operations="true"
			:allow-column-reordering="true"
			:allow-column-resizing="true"
			:column-auto-width="true"
			:load-panel="{
				enabled: true,
				indicatorSrc: require('~/static/icons/loading.gif')
			}"
			@toolbar-preparing="toolbarPreparing"
		>
			<DxFilterRow :visible="true" />
			<DxHeaderFilter :visible="true" />
			<DxGroupPanel :visible="true" />
			<DxGrouping :auto-expand-all="false" />
			<DxColumnChooser :enabled="true" />
			<DxColumnFixing :enabled="true" />
			<DxSearchPanel position="after" :visible="true" />
			<DxScrolling mode="virtual" />
			<DxPaging :enabled="true" :page-size="10" />
			<DxExport
				:enabled="true"
				:allow-export-selected-data="true"
				:file-name="$t('navigation.report.title')"
			/>
			<!-- <DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="report"
			/> -->
		</DxDataGrid>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import {
	DxDataGrid,
	DxSearchPanel,
	DxColumn,
	DxScrolling,
	DxStateStoring,
	DxRequiredRule,
	DxFilterRow,
	DxPaging,
	DxLookup,
	DxHeaderFilter,
	DxGrouping,
	DxGroupPanel,
	DxExport,
	DxColumnChooser,
	DxColumnFixing,
	DxButton
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

export default Vue.extend({
	components: {
		DxDataGrid,
		DxSearchPanel,
		DxColumn,
		DxScrolling,
		DxStateStoring,
		DxRequiredRule,
		DxFilterRow,
		DxPaging,
		DxLookup,
		DxHeaderFilter,
		DxGrouping,
		DxGroupPanel,
		DxExport,
		DxColumnChooser,
		DxColumnFixing,
		DxButton
	},
	data() {
		return {
			currentSearchValue: "getByBlank"
		};
	},
	computed: {
		dataSource() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: `${this.$dataApi.report}/${this.currentSearchValue}`
				})
			});
		}
	},
	methods: {
		toolbarPreparing(e) {
			e.toolbarOptions.items = [
				{
					location: "after",
					widget: "dxSelectBox",
					options: {
						width: 300,
						value: this.currentSearchValue,
						items: [
							"getByAllUser",
							"getByBlank",
							"getByBranch",
							"getByDuty",
							"getByUser"
						],
						onValueChanged: e => {
							this.currentSearchValue = e.value;
						}
					}
				},
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "refresh"
					},
					onClick: () => {
						this.dataSource.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>
