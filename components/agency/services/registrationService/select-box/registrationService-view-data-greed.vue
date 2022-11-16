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
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="realEstate"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="index"
				data-type="number"
				:caption="$t('labels.chapterNumber')"
			/>

			<DxColumn
				data-field="registrationStatementId"
				data-type="number"
				:caption="$t('labels.registrationStatement')"
			>
				<DxLookup
					value-expr="id"
					display-expr="id"
					:data-source="registrationStatementDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="blankId"
				data-type="number"
				:caption="$t('labels.blank')"
			>
				<DxLookup
					value-expr="id"
					display-expr="number"
					:data-source="blankDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="branchId"
				data-type="number"
				:caption="$t('labels.branch')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="branchDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="executionTime"
				data-type="date"
				:caption="$t('labels.executionTime')"
			/>
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

import RealEstateCard from "~/components/realEstate/realEstate-card.vue";

import RegistrationStatement from "~/components/agency/statements/registrationStatement/card.vue";
import SuspendStatement from "~/components/agency/statements/suspendStatement/card.vue";
import { BookTypes } from "~/infrastructure/data-sources/BookTypes";

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
		DxPaging,
		RealEstateCard,
		RegistrationStatement,
		SuspendStatement
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
			popupVisible: false,
			currentService: null,
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.services.registrationService
				}),
				filter: this.filter
			}),
			registrationStatementDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.statements.registrationStatement
			}),
			blankDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.blank
			}),
			branchDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.organization
			}),
			bookTypeDataSource: BookTypes(this)
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
		},
	},
	watch: {
		popupVisible(visible) {
			if (!visible) {
				this.currentService = null;
			}
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