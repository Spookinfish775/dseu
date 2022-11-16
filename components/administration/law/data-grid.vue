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
		@editor-preparing="editorPreparing"
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
			:file-name="$t('navigation.administration.lawTitle')"
		/>
		<DxStateStoring :enabled="true" type="localStorage" storage-key="law" />
		<DxEditing
			:allow-adding="canCreate"
			:allow-updating="canUpdate"
			:allow-deleting="fullAccess"
			:useIcons="true"
			mode="row"
		/>

		<DxColumn data-field="name" data-type="string" :caption="$t('labels.name')">
			<DxRequiredRule />
		</DxColumn>
		<DxColumn
			data-field="lawType"
			data-type="number"
			:caption="$t('labels.lawType')"
			:set-cell-value="setLawTypeValue"
		>
			<DxLookup
				value-expr="id"
				display-expr="name"
				:data-source="lawTypeDataSource"
			/>
			<DxRequiredRule />
		</DxColumn>
		<DxColumn
			data-field="encumbranceType"
			data-type="number"
			:caption="$t('labels.encumbranceType')"
		>
			<DxLookup
				value-expr="id"
				display-expr="name"
				:data-source="encumbranceTypeDataSource"
			/>
			<DxRequiredRule v-if="lawType === LawType.Encumbrance" />
		</DxColumn>
		<DxColumn
			data-field="note"
			data-type="string"
			:caption="$t('labels.note')"
		/>
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

import { LawType } from "~/infrastructure/enums/LawType";
import { Status } from "~/infrastructure/enums/Status";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { LawTypes } from "~/infrastructure/data-sources/LawTypes";
import { EncumbranceTypes } from "~/infrastructure/data-sources/EncumbranceTypes";
import { EncumbranceType } from "~/infrastructure/enums/EncumbranceType";
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
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.law,
					insertUrl: this.$dataApi.law,
					removeUrl: this.$dataApi.law,
					updateUrl: this.$dataApi.law
				})
			}),
			lawType: null,
			LawType,
			statusDataSource: Statuses(this),
			lawTypeDataSource: LawTypes(this),
			encumbranceTypeDataSource: EncumbranceTypes(this)
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Law"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Law"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Law"];
			return PermissionControler.fullAccess(permission);
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
		},
		editorPreparing(e) {
			if (e.parentType === "dataRow" && e.dataField === "encumbranceType") {
				e.editorOptions.disabled =
					typeof e.row.data.lawType !== "number" ||
					e.row.data.lawType === LawType.Law;
			}
		},
		setLawTypeValue(rowData, value) {
			this.lawType = value;
			rowData.lawType = value;
			if (rowData.lawType === LawType.Law) {
				rowData.encumbranceType = EncumbranceType.None;
			} else {
				rowData.encumbranceType = null;
			}
			if (rowData.lawType === LawType.Law) rowData.encumbranceType;
		}
	}
});
</script>
