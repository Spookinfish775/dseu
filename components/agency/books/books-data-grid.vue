<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="books"
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
			@row-dbl-click="rowDblClick"
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
				:file-name="$t('navigation.agency.booksTitle')"
			/>
			<DxStateStoring :enabled="true" type="localStorage" storage-key="books" />
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="name"
				data-type="name"
				:caption="$t('labels.name')"
			/>
			<DxColumn
				data-field="number"
				data-type="number"
				:caption="$t('labels.number')"
			/>
			<DxColumn
				data-field="bookType"
				data-type="number"
				:caption="$t('labels.bookType')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="bookTypeDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="branchId"
				data-type="number"
				:group-index="1"
				:caption="$t('labels.branch')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="branchDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="startDate"
				data-type="date"
				:caption="$t('labels.startDate')"
			/>

			<DxColumn :width="100" :buttons="editButtons" type="buttons" />

			<DxMasterDetail
				:enabled="true"
				template="bookChaptersMasterDetailTemplate"
			/>
			<template #bookChaptersMasterDetailTemplate="{data}">
				<BookChaptersMasterDetail :template-data="data.data" />
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
	DxPaging,
	DxMasterDetail
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import BookChaptersMasterDetail from "./bookChapters-master-detail/data-grid.vue";

import { BookTypes } from "~/infrastructure/data-sources/BookTypes";
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
		DxMasterDetail,
		DxPaging,
		BookChaptersMasterDetail
	},
	data() {
		return {
			books: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.books
				})
			}),
			branchDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.organization
			}),
			bookTypeDataSource: BookTypes(this)
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Book"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Book"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Book"];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(`/agency/books/${e.row.data.id}`);
					}
				}
			];
		}
	},
	methods: {
		rowDblClick(e) {
			this.$router.push(`/agency/books/${e.data.id}`);
		},
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
						this.$router.push(`/agency/books/create`);
					}
				},
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "refresh"
					},
					onClick: () => {
						this.books.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>

<style scoped></style>
