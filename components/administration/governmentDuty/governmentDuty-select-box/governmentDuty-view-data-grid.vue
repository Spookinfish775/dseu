<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="dataSource"
			:hoverStateEnabled="true"
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
				:file-name="$t('navigation.administration.governmentDutyTitle')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="governmentDutyViewDataGrid"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

      <DxColumn
        data-field="individualPriceCounted"
        data-type="string"
        :caption="$t('labels.individualCounted')"
      />
      <DxColumn
        data-field="legalEntityPriceCounted"
        data-type="string"
        :caption="$t('labels.legalEntityCounted')"
      />
			<DxColumn
				data-field="name"
				data-type="string"
				:caption="$t('labels.name')"
				width="200"
			/>
			<DxColumn
				data-field="legalEntityPrice"
				data-type="number"
				:caption="$t('labels.legalEntity')"
			/>
			<DxColumn
				data-field="individualPrice"
				data-type="number"
				:caption="$t('labels.individual')"
			/>
			<DxColumn
				data-field="governmentDutyGroupId"
				data-type="number"
				:caption="$t('labels.governmentDutyGroup')"
				width="200"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="governmentDutyGroupDataSource"
				/>
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
			</DxColumn>
			<DxColumn :width="70" :buttons="editButtons" type="buttons" />
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
	DxPaging
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import { Statuses } from "~/infrastructure/data-sources/Statuses";

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
	props: {
		valueExpr: {
			type: String,
			default: "id"
		},
		filter: {
			type: Array,
			default: null
		}
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.governmentDuty
				}),
				filter: this.filter
			}),
			statusDataSource: Statuses(this),
			governmentDutyGroupDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.governmentDutyGroup
			})
		};
	},
	computed: {
		editButtons() {
			return [
				{
					hint: this.$t("labels.choose"),
					icon: "check",
					onClick: e => {
						this.$emit("valueSelected", e.row.data[this.valueExpr]);
					}
				}
			];
		}
	},
	methods: {
		rowDblClick(e) {
			this.$emit("valueSelected", e.data[this.valueExpr]);
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
		}
	}
});
</script>
