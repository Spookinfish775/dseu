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
			:file-name="$t('navigation.agency.legalAidServiceTitle')"
		/>
		<DxStateStoring
			:enabled="true"
			type="localStorage"
			storage-key="legalAidService"
		/>
		<DxEditing
			:allow-adding="false"
			:allow-updating="false"
			:allow-deleting="false"
			:useIcons="true"
			mode="row"
		/>

		<DxColumn
			data-field="legalAidStatementId"
			data-type="number"
			:caption="$t('labels.legalAidStatement')"
		>
			<DxLookup
				value-expr="id"
				display-expr="id"
				:data-source="legalAidStatementDataSource"
			/>
		</DxColumn>

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
					loadUrl: this.$dataApi.services.legalAidService,
					insertUrl: this.$dataApi.services.legalAidService,
					removeUrl: this.$dataApi.services.legalAidService,
					updateUrl: this.$dataApi.services.legalAidService
				})
			}),
			legalAidStatementDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.statements.legalAidStatement
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidService"
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
							`/agency/services/legalAidService/${e.row.data.id}`
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
						this.$router.push(`/agency/services/legalAidService/create`);
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

