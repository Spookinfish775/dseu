<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="dataSource"
			:show-borders="true"
			:errorRowEnabled="false"
			:remote-operations="true"
			:allow-column-reordering="true"
			:allow-column-resizing="true"
			:column-auto-width="true"
			:load-panel="{
				enabled: true,
				indicatorSrc: require('~/static/icons/loading.gif')
			}"
			@init-new-row="initNewRow"
			@row-updating="rowUpdating"
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
				:file-name="$t('navigation.caseBlock.title')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="archive"
			/>
			<DxEditing
				:allow-adding="canCreate"
				:allow-updating="canUpdate"
				:allow-deleting="fullAccess"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="name"
				data-type="string"
				:caption="$t('labels.name')"
			>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="branchId"
				data-type="number"
				:caption="$t('labels.branch')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="branchDataSource"
				/>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="status"
				data-type="number"
				:caption="$t('labels.status')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="statusDataSource"
				/>
			</DxColumn>

			<DxColumn :width="100" :buttons="editButtons" type="buttons" />

			<DxMasterDetail :enabled="true" template="fileCabinetMasterDetail" />
			<template #fileCabinetMasterDetail="{data}">
				<FileCabinetMasterDetail :archiveId="data.data.id" />
			</template>
		</DxDataGrid>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import {
	DxSearchPanel,
	DxDataGrid,
	DxColumn,
	DxEditing,
	DxScrolling,
	DxRequiredRule,
	DxStateStoring,
	DxFilterRow,
	DxLookup,
	DxPaging,
	DxHeaderFilter,
	DxGrouping,
	DxGroupPanel,
	DxExport,
	DxMasterDetail,
	DxColumnChooser,
	DxColumnFixing
} from "devextreme-vue/data-grid";

import FileCabinetMasterDetail from "../archive/file-cabinet-master-detail.vue";

import DataSource from "devextreme/data/data_source";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { Status } from "~/infrastructure/enums/Status";

export default Vue.extend({
	components: {
		DxSearchPanel,
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxScrolling,
		DxRequiredRule,
		DxStateStoring,
		DxFilterRow,
		DxLookup,
		DxPaging,
		DxHeaderFilter,
		DxMasterDetail,
		DxGrouping,
		DxGroupPanel,
		DxExport,
		DxColumnChooser,
		DxColumnFixing,
		FileCabinetMasterDetail
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.archive,
					updateUrl: this.$dataApi.archive,
					removeUrl: this.$dataApi.archive,
					insertUrl: this.$dataApi.archive
				})
			}),
			branchDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.organization
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Archive"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Archive"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Archive"];
			return PermissionControler.fullAccess(permission);
		},
		statusDataSource() {
			return Statuses(this);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					visible: e => {
						return e.row.data.id ? true : false;
					},
					onClick: e => {
						this.$router.push(`/archive/archive/${e.row.data.id}`);
					}
				},
				{
					name: "edit",
					hint: this.$t("labels.edit"),
					icon: "edit"
				},
				{
					name: "delete"
				}
			];
		}
	},
	methods: {
		initNewRow(e): void {
			e.data.status = Status.Active;
		},
		rowUpdating(e) {
			e.newData = Object.assign(e.oldData, e.newData);
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
				...e.toolbarOptions.items
			];
		}
	}
});
</script>
