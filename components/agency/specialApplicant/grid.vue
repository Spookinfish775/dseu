<template>
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
		@toolbar-preparing="toolbarPreparing"
		@row-dbl-click="rowDblClick"
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
			:file-name="$t('navigation.agency.specialApplicantTitle')"
		/>
		<DxStateStoring
			:enabled="true"
			type="localStorage"
			storage-key="specialApplicant"
		/>
		<DxEditing
			:allow-adding="false"
			:allow-updating="false"
			:allow-deleting="false"
			:useIcons="true"
			mode="row"
		/>
		<DxColumn
			data-field="id"
			:caption="$t('navigation.agency.specialApplicantTypeId')"
		></DxColumn>
		<DxColumn
			data-field="fullInformation"
			:caption="$t('navigation.agency.specialApplicantFullInformation')"
		></DxColumn>
		<DxColumn
			data-field="identityDocumentName"
			:caption="$t('navigation.agency.specialApplicantIdentityDocumentName')"
		></DxColumn>
		<DxColumn
			data-field="identityDocumentNumber"
			:caption="$t('navigation.agency.specialApplicantIdentityDocumentNumber')"
		></DxColumn>
		<DxColumn
			data-field="identityDocumentIssueDate"
			:caption="
				$t('navigation.agency.specialApplicantIdentityDocumentIssueDate')
			"
		></DxColumn>
		<DxColumn
			data-field="identityDocumentIssuedBy"
			:caption="
				$t('navigation.agency.specialApplicantIdentityDocumentIssuedBy')
			"
		></DxColumn>
		<DxColumn :width="100" :buttons="editButtons" type="buttons" />
	</DxDataGrid>
</template>

<script lang="ts">
import Vue from "vue";

import {
	DxDataGrid,
	DxSearchPanel,
	DxColumn,
	DxLabel,
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
	DxExport,
	DxColumnChooser,
	DxColumnFixing
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxDataGrid,
		DxSearchPanel,
		DxColumn,
		DxLabel,
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
		DxExport,
		DxColumnChooser,
		DxColumnFixing
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.specialApplicant,
					insertUrl: this.$dataApi.specialApplicant,
					removeUrl: this.$dataApi.specialApplicant,
					updateUrl: this.$dataApi.specialApplicant
				})
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"SpecialApplicant"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"SpecialApplicant"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"SpecialApplicant"
			];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(`/agency/specialApplicant/${e.row.data.id}`);
					}
				}
			];
		}
	},
	methods: {
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
						this.$router.push(`/agency/specialApplicant/create`);
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
		},
		rowDblClick(e) {
			this.$router.push(`/agency/specialApplicant/${e.data.id}`);
		}
	}
});
</script>
