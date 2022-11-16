<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="dataSource"
			:show-borders="true"
			:hoverStateEnabled="true"
			:errorRowEnabled="false"
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
				:file-name="$t('navigation.reports.reportNotification.title')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="notificationReport"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>
			<DxColumn
				data-field="letterSenderOrganizationname"
				data-type="string"
				:caption="$t('labels.letterSenderOrganizationName')"
			/>
			<DxColumn
				data-field="notificationCount"
				data-type="number"
				:caption="$t('labels.notificationCount')"
			/>
			<template #dataFilter>
				<DataFilter
					@startDateChanged="startDateChanged"
					@endDateChanged="endDateChanged"
				/>
			</template>
		</DxDataGrid>
	</div>
</template>

<script>
import Vue from "vue";

import moment from "moment";
import {
	DxDataGrid,
	DxSearchPanel,
	DxColumn,
	DxLabel,
	DxEditing,
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
	DxColumnFixing
} from "devextreme-vue/data-grid";

import DataSource from "devextreme/data/data_source";

import DataFilter from "./components/data-filter.vue";

import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxDataGrid,
		DxSearchPanel,
		DxColumn,
		DxLabel,
		DxEditing,
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
		DataFilter
	},
	data() {
		moment.locale('en');
		return {
			startDate: moment(new Date())
				.format("L")
				.replaceAll("/", "."),
			endDate: moment(new Date())
				.format("L")
				.replaceAll("/", "."),
			statusDataSource: Statuses(this)
		};
	},
	computed: {
		dataSource() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: `${this.$dataApi.reportByNotification}?StartDate=${this.startDate}&EndDate=${this.endDate}`
				})
			});
		}
	},
	methods: {
		startDateChanged($event) {
			this.startDate = moment($event)
				.format("L")
				.replaceAll("/", ".");
		},
		endDateChanged($event) {
			this.endDate = moment($event)
				.format("L")
				.replaceAll("/", ".");
		},
		toolbarPreparing(e) {
			e.toolbarOptions.items = [
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
				...e.toolbarOptions.items,
				{
					template: "dataFilter",
					location: "after"
				}
			];
		}
	}
});
</script>

<style lang="scss">
</style>

