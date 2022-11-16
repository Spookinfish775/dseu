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
			<DxExport
				:enabled="true"
				:allow-export-selected-data="true"
				:file-name="$t('navigation.realEstate.title')"
			/>
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
				data-field="address"
				data-type="string"
				:caption="$t('labels.address')"
				cell-template="grid-cell"
			/>

			<template #grid-cell="{ data }">
				<div :class="EncumbranceProcessType[data.data.encumbranceProcessType]">
					{{ data.data.address }}
				</div>
			</template>

			<DxColumn
				data-field="caseRealEstateType"
				data-type="number"
				width="300"
				:caption="$t('labels.realEstateType')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="realEstateTypeDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="realEstateMissionId"
				data-type="number"
				width="100"
				:caption="$t('labels.realEstateMission')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="realEstateMissionDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="encumbranceProcessType"
				data-type="number"
				width="100"
				:caption="$t('labels.encumbranceProcessType')"
				cell-template="encumbranceProcessType-template"
			/>
			<DxColumn
				data-field="conventionalNumber"
				width="100"
				data-type="string"
				:caption="$t('labels.conventionalNumber')"
			/>

			<template #encumbranceProcessType-template="{ data }">
				<div :class="EncumbranceProcessType[data.data.encumbranceProcessType]">
					<DxSelectBox
						:height="20"
						stylingMode="filled"
						:read-only="true"
						:value="data.data.encumbranceProcessType"
						value-expr="id"
						display-expr="name"
						:data-source="encumbranceProcessTypeDataSource"
					/>
				</div>
			</template>

			<DxColumn :width="100" :buttons="editButtons" type="buttons" />
		</DxDataGrid>
		<BasePopup
			ref="basePopup"
			width="70%"
			height="80vh"
			:show-title="true"
			:drag-enabled="false"
			:close-on-outside-click="true"
		>
			<RealEstateCard
				:data="currentRealEstate"
				@successedSaved="realEstateSaved"
				@successedDeleted="realEstateDeleted"
			/>
		</BasePopup>
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
import DxSelectBox from "devextreme-vue/select-box";

import BasePopup from "~/components/page/popup.vue";
import RealEstateCard from "~/components/realEstate/realEstate-card.vue";

import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
import { EncumbranceProcessType } from "~/infrastructure/enums/EncumbranceProcessType";
import { EncumbranceProcessTypes } from "~/infrastructure/data-sources/EncumbranceProcessTypes";

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
		DxSelectBox,
		BasePopup
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
			currencyDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.currency
			}),
			realEstateTypeDataSource: RealEstateTypes(this),
			realEstateMissionDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.realEstateMission
			}),
			currentRealEstate: null,
			encumbranceProcessTypeDataSource: EncumbranceProcessTypes(this),
			EncumbranceProcessType
		};
	},
	computed: {
		dataSource() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.realEstate
				}),
				filter: this.filter
			});
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.choose"),
					icon: "check",
					onClick: e => {
						this.$emit("valueSelected", e.row.data[this.valueExpr]);
					}
				},
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.currentRealEstate = e.row.data;
						this.$refs["basePopup"].open();
					}
				}
			];
		}
	},
	methods: {
		realEstateSaved() {
			this.realEstate.reload();
		},
		realEstateDeleted() {
			this.realEstate.reload();
		},
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
						this.realEstate.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>

<style lang="scss">
.EncumbranceLetter {
	background-color: yellow;
}
.Forced {
	background-color: red;
	color: white !important;
	input {
		color: white !important;
	}
}
.Voluntary {
	background-color: pink;
}
</style>
