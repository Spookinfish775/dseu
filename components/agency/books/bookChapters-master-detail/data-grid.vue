<template>
	<div>
		<p>{{ $t("labels.bookChapterDescription") }}</p>

		<DxDataGrid
			height="514px"
			:data-source="bookChapters"
			:show-borders="true"
			:errorRowEnabled="false"
			:remote-operations="true"
			:allow-column-reordering="false"
			:allow-column-resizing="false"
			:column-auto-width="true"
			:load-panel="{
				enabled: true,
				indicatorSrc: require('~/static/icons/loading.gif')
			}"
			@init-new-row="initNewRow"
			@row-updating="rowUpdating"
			@toolbar-preparing="toolbarPreparing"
		>
			<DxSearchPanel position="after" :visible="true" />
			<DxScrolling :scrollByThumb="true" mode="virtual" />
			<DxPaging :enabled="true" :page-size="10" />
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="bookChapters"
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

			<DxMasterDetail
				:enabled="true"
				template="chapterNumberMasterDetailTemplate"
			/>
			<template #chapterNumberMasterDetailTemplate="{data}">
				<ChapterNumberMasterDetailTemplate :template-data="data.data" />
			</template>
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
	DxPaging,
	DxLookup,
	DxMasterDetail
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import ChapterNumberMasterDetailTemplate from "../chapterNumber-master-detail/data-grid.vue";

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
		DxPaging,
		DxLookup,
		DxMasterDetail,
		ChapterNumberMasterDetailTemplate
	},
	props: {
		templateData: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			bookChapters: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.bookChapters,
					insertUrl: this.$dataApi.bookChapters,
					removeUrl: this.$dataApi.bookChapters,
					updateUrl: this.$dataApi.bookChapters
				}),
				filter: ["bookId", "=", this.templateData.id]
			}),
			statusDataSource: Statuses(this)
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"BookChapter"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"BookChapter"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"BookChapter"
			];
			return PermissionControler.fullAccess(permission);
		}
	},
	methods: {
		initNewRow(e): void {
			e.data.status = Status.Active;
			e.data.bookId = this.templateData.id;
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
						this.bookChapters.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>