<template>
	<div v-if="realEstateId">
		<DxDataGrid
			height="300"
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
			:selection="{ mode: 'single' }"
			key-expr="id"
			@selection-changed="onSelectionChanged"
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
				:enabled="false"
				type="localStorage"
				storage-key="realEstatePart"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				width="200"
				data-field="applicantId"
				data-type="number"
				:caption="$t('labels.applicant')"
			>
				<DxLookup
					value-expr="id"
					display-expr="fullInformation"
					:data-source="applicantDataSource"
				/>
			</DxColumn>

			<DxColumn
				data-field="numerator"
				data-type="number"
				:caption="$t('labels.numerator')"
			/>
			<DxColumn
				data-field="denominator"
				data-type="number"
				:caption="$t('labels.denominator')"
			/>
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
		DxPaging
	},
	props: {
		realEstateId: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			applicantDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.applicant
			})
		};
	},
	computed: {
		dataSource() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: `${this.$dataApi.realEstatePart}/RealEstate/${this.realEstateId}`
				})
			});
		},
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"RegistrationService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"RegistrationService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"RegistrationService"
			];
			return PermissionControler.fullAccess(permission);
		}
	},
	methods: {
		onSelectionChanged({ selectedRowsData }) {
			const data = selectedRowsData[0];
			console.log(data);
			
			this.$emit("valueSelected", data.id);
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

