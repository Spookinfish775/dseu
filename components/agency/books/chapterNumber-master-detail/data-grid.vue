<template>
	<div>
		<p>{{$t("labels.chapterNumberDescription")}}</p>
		<DxDataGrid
			height="300px"
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
			@toolbar-preparing="toolbarPreparing"
		>
			<DxFilterRow :visible="true" />
			<DxHeaderFilter :visible="true" />
			<DxColumnFixing :enabled="true" />
			<DxSearchPanel position="after" :visible="true" />
			<DxScrolling mode="virtual" />
			<DxPaging :enabled="true" :page-size="10" />
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="chapterNumber"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="canUpdate"
				:allow-deleting="fullAccess"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="number"
				data-type="number"
				:caption="$t('labels.number')"
			/>
			<DxColumn
				data-field="isUsed"
				data-type="boolean"
				:caption="$t('labels.isUsed')"
			/>

			<DxColumn :width="100" :buttons="editButtons" type="buttons" />

			<DxSummary>
				<DxTotalItem
					column="number"
					summary-type="count"
					value-format="decimal"
				/>
			</DxSummary>
		</DxDataGrid>
		<Popup
			:title="$t('navigation.agency.createChapterNumber')"
			width="800px"
			ref="popup"
		>
			<CreateCard
				:book-chapter-id="templateData.id"
				@successedSaved="closeCreating"
			/>
		</Popup>
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
	DxColumnChooser,
	DxColumnFixing,
	DxSummary,
	DxTotalItem
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import Popup from "~/components/page/popup.vue";
import CreateCard from ".//create.vue";

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
		DxColumnChooser,
		DxColumnFixing,
		DxSummary,
		DxTotalItem,
		Popup,
		CreateCard
	},
	props: {
		templateData: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.chapterNumber,
					removeUrl: this.$dataApi.chapterNumber
				}),
				filter: ["bookChapterId", "=", this.templateData.id],
				sort: ["number"]
			}),
			bookChaptersDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.bookChapters
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"ChapterNumber"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"ChapterNumber"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"ChapterNumber"
			];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					name: "delete",
					visible: e => !e.row.data.isUsed
				}
			];
		}
	},
	methods: {
		async closeCreating() {
			this.dataSource.reload();
			await this.$refs.popup.close();
		},
		toolbarPreparing(e) {
			e.toolbarOptions.items = [
				{
					location: "after",
					widget: "dxButton",
					locateInMenu: "auto",
					options: {
						icon: "plus",
						visible: this.canCreate
					},
					onClick: async () => {
						await this.$refs.popup.open();
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