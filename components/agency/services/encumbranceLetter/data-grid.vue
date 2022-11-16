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
				:file-name="$t('navigation.agency.encumbranceLetterTitle')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="encumbranceLetter"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="encumbranceId"
				data-type="number"
				:caption="$t('labels.encumbrance')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="encumbranceDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="realEstateId"
				data-type="number"
				:caption="$t('labels.realEstate')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="realEstateDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="realEstateAddress"
				data-type="string"
				:caption="$t('labels.realEstateAddress')"
			/>
			<DxColumn
				data-field="enteredDate"
				data-type="date"
				:caption="$t('labels.enteredDate')"
			/>
			<DxColumn
				data-field="isReleased"
				data-type="boolean"
				:caption="$t('labels.isReleased')"
			/>
			<DxColumn :width="100" :buttons="editButtons" type="buttons" />
		</DxDataGrid>
		<EncumbranceReleasePopup
			ref="encumbranceReleasePopup"
			:currentRow="currentRow"
		/>
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

import EncumbranceReleasePopup from "~/components/agency/services/encumbranceRelease/popup.vue";

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
		DxPaging,
		EncumbranceReleasePopup
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.encumbranceLetter
				})
			}),
			encumbranceDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.law
			}),
			realEstateDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.realEstate
			}),
			currentRow: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceLetter"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceLetter"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceLetter"
			];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(
							`/agency/services/encumbranceLetter/${e.row.data.id}`
						);
					}
				},
				{
					hint: this.$t("labels.encumbranceRelease"),
					icon: "/icons/navigation/encumbranceReleaseIcon.svg",
					cssClass: "data-grid-icon",
					onClick: e => {
						this.currentRow = e.row.data;
						this.$refs["encumbranceReleasePopup"].open();
					}
				}
			];
		}
	},
	methods: {
		rowDblClick(e) {
			this.$router.push(`/agency/services/encumbranceLetter/${e.data.id}`);
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
						this.$router.push(`/agency/services/encumbranceLetter/create`);
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