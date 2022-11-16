<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="history"
			:show-borders="true"
			:hoverStateEnabled="true"
			:errorRowEnabled="false"
			:hover-state-enabled="true"
			:remote-operations="true"
			:allow-column-reordering="true"
			:allow-column-resizing="true"
			:column-auto-width="true"
			:load-panel="{
				enabled: true,
				indicatorSrc: require('~/static/icons/loading.gif')
			}"
			@row-dbl-click="e => showChangesData(e.data)"
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
				:file-name="$t('navigation.history.title')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="history"
			/>

			<DxColumn
				data-field="action"
				data-type="string"
				:caption="$t('history.action')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="actionDataSource"
				/>
			</DxColumn>
			<DxColumn :caption="$t('history.table')">
				<DxColumn
					data-field="table"
					data-type="string"
					:caption="$t('history.tableTranslate')"
				>
					<DxLookup
						value-expr="id"
						display-expr="name"
						:data-source="tableDataSource"
					/>
				</DxColumn>
				<DxColumn
					name="tableOriginal"
					data-field="table"
					data-type="string"
					:caption="$t('history.tableOriginal')"
				/>
			</DxColumn>
			<DxColumn
				data-field="userId"
				data-type="string"
				:caption="$t('history.user')"
			>
				<DxLookup
					value-expr="id"
					display-expr="fullName"
					:data-source="usersDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="dateTime"
				data-type="datetime"
				:caption="$t('history.dateTime')"
			/>
      <DxColumn
        data-field="userName"
        data-type="string"
        :caption="$t('history.userName')"
      />
      <DxColumn
        data-field="machineName"
        data-type="string"
        :caption="$t('history.machineName')"
      />

			<DxColumn type="buttons" :visible="true">
				<DxButton
					icon="expand"
					:hint="$t('history.buttons.showChangesData')"
					:visible="e => isUpdateAction(e)"
					:on-click="e => showChangesData(e.row.data)"
				/>
			</DxColumn>
		</DxDataGrid>
		<BasePopup
			ref="historyColumnPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('history.historyColumn')"
		>
			<ChangedDataCard :data="currentChangesData" />
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import {
	DxDataGrid,
	DxSearchPanel,
	DxColumn,
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
	DxColumnFixing,
	DxButton
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import ChangedDataCard from "./changes-data-card.vue";

import { Action } from "~/infrastructure/enums/history/Action";
import { Actions } from "~/infrastructure/data-sources/history/Actions";
import { Tables } from "~/infrastructure/data-sources/history/Tables";

export default Vue.extend({
	components: {
		DxDataGrid,
		DxSearchPanel,
		DxColumn,
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
		DxColumnFixing,
		BasePopup,
		DxButton,
		ChangedDataCard
	},
	data() {
		return {
			history: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.history
				})
			}),
			usersDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.user
			}),
			actionDataSource: Actions(this),
			tableDataSource: Tables(this),
			currentChangesData: []
		};
	},
	methods: {
		showChangesData(data): void {
			if (data.action === Action.Update) {
				this.currentChangesData = data.historyColumn;
				this.$refs["historyColumnPopup"].open();
			}
		},
		isUpdateAction(e): boolean {
			return e.row.data.action === Action.Update;
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
						this.history.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>
