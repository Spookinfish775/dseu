<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="userBooks"
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
			@row-updating="rowUpdating"
			@toolbar-preparing="toolbarPreparing"
			@editorPreparing="onEditorPreparing"
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
				:file-name="$t('navigation.agency.userBooksTitle')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="userBooks"
			/>
			<DxEditing
				:allow-adding="canCreate"
				:allow-updating="canUpdate"
				:allow-deleting="fullAccess"
				:useIcons="true"
				mode="row"
			/>
			<DxColumn
				data-field="userId"
				data-type="string"
				:caption="$t('labels.user')"
				:set-cell-value="setUserValue"
			>
				<DxLookup
					value-expr="id"
					display-expr="fullName"
					:data-source="userDataSource"
				/>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="bookId"
				data-type="number"
				:caption="$t('labels.books')"
			>
				<DxLookup
					value-expr="id"
					display-expr="fullBookInformation"
					:data-source="bookDataSource"
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
			userBooks: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.userBooks,
					insertUrl: this.$dataApi.userBooks,
					removeUrl: this.$dataApi.userBooks,
					updateUrl: this.$dataApi.userBooks
				})
			}),
			bookDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.books
			}),
			userDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.user
			}),
			setUserValue(rowData, value) {
				rowData.bookId = null;
				this.defaultSetCellValue(rowData, value);
			}
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["UserBook"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["UserBook"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["UserBook"];
			return PermissionControler.fullAccess(permission);
		}
	},
	methods: {
		rowUpdating(e) {
			e.newData = Object.assign(e.oldData, e.newData);
		},
		onEditorPreparing(e) {
			if (e.parentType === "dataRow" && e.dataField === "bookId") {
				e.editorOptions.disabled = typeof e.row.data.userId !== "string";
			}
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
						this.userBooks.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>
