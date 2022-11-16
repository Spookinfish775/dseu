<template>
	<div>
		<DxDataGrid
			ref="districtDataGrid"
			height="80vh"
			:data-source="district"
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
			@initialized="initialized"
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
				:file-name="$t('navigation.administration.districtTitle')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="district"
			/>
			<DxEditing
				:allow-adding="canCreate"
				:allow-updating="canUpdate"
				:allow-deleting="fullAccess"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="regionId"
				data-type="number"
				:caption="$t('labels.region')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="regionDataSource"
				/>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="name"
				data-type="string"
				:caption="$t('labels.name')"
			>
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
				<DxRequiredRule />
			</DxColumn>
		</DxDataGrid>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import {
	DxDataGrid,
	DxSearchPanel,
	DxColumn,
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

import { Status } from "~/infrastructure/enums/Status";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxDataGrid,
		DxSearchPanel,
		DxColumn,
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
			district: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.district,
					insertUrl: this.$dataApi.district,
					removeUrl: this.$dataApi.district,
					updateUrl: this.$dataApi.district
				})
			}),
			regionDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.region
			}),
			statusDataSource: Statuses(this)
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
		}
	},
	methods: {
		initialized(e) {
			if (this.$route.query.regionId) {
				setTimeout(() => {
					this.$refs["districtDataGrid"].instance.addRow();
				}, 300);
			}
		},
		initNewRow(e): void {
			e.data.status = Status.Active;
			if (this.$route.query.regionId) {
				e.data.regionId = +this.$route.query.regionId;
				delete this.$route.query.regionId;
			}
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
						this.district.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>
