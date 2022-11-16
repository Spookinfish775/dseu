<template>
	<div>
		<DxDataGrid
			height="80vh"
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
				:file-name="$t('navigation.caseBlock.title')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="registrationServiceCaseViewDataGrid"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="caseNumber"
				data-type="string"
				:caption="$t('labels.caseNumber')"
			/>
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
				data-field="realEstateId"
				data-type="number"
				:caption="$t('labels.realEstate')"
			>
				<DxLookup
					value-expr="id"
					display-expr="address"
					:data-source="realEstateDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="caseRealEstateType"
				data-type="number"
				:caption="$t('labels.realEstateType')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="realEstateTypeDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="archiveStatus"
				data-type="number"
				:caption="$t('labels.archiveStatus')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="archiveStatusDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="openDate"
				data-type="date"
				:caption="$t('labels.openDate')"
			/>
			<DxColumn
				data-field="closeDate"
				data-type="date"
				:caption="$t('labels.closeDate')"
			/>

			<DxMasterDetail :enabled="true" template="masterDetailTemplate" />
			<template #masterDetailTemplate="{ data }">
				<MasterDetailTemplate
					:case="data.data"
					@valueSelected="valueSelected"
				/>
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
	DxScrolling,
	DxRequiredRule,
	DxStateStoring,
	DxMasterDetail,
	DxFilterRow,
	DxLookup,
	DxPaging,
	DxHeaderFilter,
	DxGrouping,
	DxGroupPanel,
	DxExport,
	DxColumnChooser,
	DxColumnFixing
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import RealEstateCard from "~/components/realEstate/realEstate-card.vue";
import MasterDetailTemplate from "./master-detail-template.vue";

import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
import { ArchiveStatuses } from "~/infrastructure/data-sources/ArchiveStatuses";

export default Vue.extend({
	components: {
		DxSearchPanel,
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxScrolling,
		DxRequiredRule,
		DxStateStoring,
		DxMasterDetail,
		DxFilterRow,
		DxLookup,
		DxPaging,
		DxHeaderFilter,
		DxGrouping,
		DxGroupPanel,
		DxExport,
		DxColumnChooser,
		DxColumnFixing,
		MasterDetailTemplate,
		RealEstateCard
	},
	props: {
		registrationStatementId: {
			type: Number
		},
		filter: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			branchDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.organization
			}),
			realEstateDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.realEstate
			}),
			realEstateTypeDataSource: RealEstateTypes(this),
			archiveStatusDataSource: ArchiveStatuses(this)
		};
	},
	computed: {
		dataSource() {
			if (this.registrationStatementId) {
				return new DataSource({
					store: this.$dxStore({
						key: "id",
						loadUrl: `${this.$dataApi.case}/RegistrationService/${this.registrationStatementId}`
					}),
					filter: this.filter
				});
			} else {
				return new DataSource({
					store: this.$dxStore({
						key: "id",
						loadUrl: this.$dataApi.case
					}),
					filter: this.filter
				});
			}
		}
	},
	methods: {
		valueSelected(value) {
			this.$emit("valueSelected", value);
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