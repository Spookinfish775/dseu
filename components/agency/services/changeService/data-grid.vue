<template>
	<DxDataGrid
		height="80vh"
		:data-source="dataSource"
		:show-borders="true"
		:hoverStateEnabled="true"
		:errorRowEnabled="false"
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
			:file-name="$t('navigation.agency.changeServiceTitle')"
		/>
		<DxStateStoring
			:enabled="true"
			type="localStorage"
			storage-key="changeService"
		/>
		<DxEditing
			:allow-adding="false"
			:allow-updating="false"
			:allow-deleting="false"
			:useIcons="true"
			mode="row"
		/>

		<DxColumn
			data-field="changeStatementId"
			data-type="number"
			:caption="$t('labels.changeStatement')"
		>
			<DxLookup
				value-expr="id"
				display-expr="id"
				:data-source="changeStatementDataSource"
			/>
		</DxColumn>
		<DxColumn
			data-field="caseBookId"
			data-type="number"
			:caption="$t('labels.caseBook')"
		>
			<DxLookup
				value-expr="id"
				display-expr="caseId"
				:data-source="caseBookDataSource"
			/>
		</DxColumn>
		<DxColumn
			data-field="changedDescription"
			data-type="string"
			:caption="$t('labels.changedDescription')"
		/>

		<DxColumn :width="100" :buttons="editButtons" type="buttons" />
	</DxDataGrid>
</template>



<script lang="ts">
import Vue from "vue";

import {
	DxSearchPanel,
	DxDataGrid,
	DxColumn,
	DxEditing,
	DxHeaderFilter,
	DxScrolling,
	DxLookup,
	DxGrouping,
	DxGroupPanel,
	DxExport,
	DxColumnChooser,
	DxColumnFixing,
	DxFilterRow,
	DxStateStoring,
	DxPaging
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxSearchPanel,
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxHeaderFilter,
		DxScrolling,
		DxLookup,
		DxGrouping,
		DxGroupPanel,
		DxExport,
		DxColumnChooser,
		DxColumnFixing,
		DxFilterRow,
		DxStateStoring,
		DxPaging
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.services.changeService,
					insertUrl: this.$dataApi.services.changeService,
					removeUrl: this.$dataApi.services.changeService,
					updateUrl: this.$dataApi.services.changeService
				})
			}),
			changeStatementDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.statements.changeStatement
			}),
			caseBookDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.caseBook
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"ChangeService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"ChangeService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"ChangeService"
			];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(
							`/agency/services/changeService/${e.row.data.id}`
						);
					}
				}
			];
		}
	},
	methods: {
		toolbarPreparing(e) {
			e.toolbarOptions.items = [
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "plus",
						visible: this.canCreate
					},
					onClick: () => {
						this.$router.push(`/agency/services/changeService/create`);
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