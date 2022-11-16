<template>
	<div>
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
			@row-dbl-click="rowDblClick"
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
				:file-name="$t('navigation.agency.stampsTitle')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="stamps"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>
			<DxColumn data-field="number" :caption="$t('labels.stamp.number')" />
			<DxColumn data-field="userId" :caption="$t('labels.stamp.userId')">
				<DxLookup
					value-expr="id"
					display-expr="fullName"
					:data-source="userDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="organizationId"
				:caption="$t('labels.stamp.organizationId')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="organizationDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="createDate"
				data-type="date"
				:caption="$t('labels.stamp.createDate')"
			/>
		</DxDataGrid>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

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
		DxColumnFixing
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.stamp
				})
			}),
			userDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.user
			}),
			organizationDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.organization
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Stamp"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Stamp"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Stamp"];
			return PermissionControler.fullAccess(permission);
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
						this.$router.push(`/agency/stamps/create`);
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
		},
		rowDblClick(e) {
			this.$router.push(`/agency/stamps/${e.data.id}`);
		}
	}
});
</script>