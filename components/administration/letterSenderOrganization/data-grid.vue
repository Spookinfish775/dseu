<template>
	<DxDataGrid
		height="70vh"
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
			:file-name="$t('labels.applicants')"
		/>
		<DxStateStoring
			:enabled="true"
			type="localStorage"
			storage-key="letterSenderOrganization"
		/>
		<DxEditing
			:allow-adding="false"
			:allow-updating="false"
			:allow-deleting="false"
			:useIcons="true"
		/>

		<DxColumn
			data-field="letterSenderOrganizationTypeId"
			data-type="number"
			:caption="$t('labels.letterSenderOrganizationType')"
		>
			<DxLookup
				value-expr="id"
				display-expr="name"
				:data-source="letterSenderOrganizationTypeDataSource"
			/>
		</DxColumn>
		<DxColumn
			data-field="name"
			data-type="string"
			:caption="$t('labels.name')"
		/>
		<DxColumn
			data-field="legalAddress"
			data-type="string"
			:caption="$t('labels.legalAddress')"
		/>
		<DxColumn
			data-field="postAddress"
			data-type="string"
			:caption="$t('labels.postAddress')"
		/>
		<DxColumn
			data-field="email"
			data-type="string"
			:caption="$t('labels.email')"
		/>
		<DxColumn
			data-field="phones"
			data-type="string"
			:caption="$t('labels.phones')"
		/>
		<DxColumn
			data-field="webSite"
			data-type="string"
			:caption="$t('labels.webSite')"
		/>
		<DxColumn
			data-field="nonresident"
			data-type="boolean"
			:caption="$t('labels.nonresident')"
		/>
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

		<DxColumn :width="100" :buttons="editButtons" type="buttons" />
	</DxDataGrid>
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
	DxPaging,
	DxHeaderFilter,
	DxGrouping,
	DxGroupPanel,
	DxExport,
	DxColumnChooser,
	DxColumnFixing,
	DxFormItem,
	DxLookup
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { Statuses } from "~/infrastructure/data-sources/Statuses";

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
		DxPaging,
		DxHeaderFilter,
		DxGrouping,
		DxGroupPanel,
		DxExport,
		DxColumnChooser,
		DxColumnFixing,
		DxFormItem,
		DxLookup
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.letterSenderOrganization
				})
			}),
			statusDataSource: Statuses(this),
			citizenshipDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.citizenship
			}),
			letterSenderOrganizationTypeDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.letterSenderOrganizationType
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["LetterSenderOrganization"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["LetterSenderOrganization"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["LetterSenderOrganization"];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(
							`/administration/letterSenderOrganization/${e.row.data.id}`
						);
					}
				}
			];
		}
	},
	methods: {
		rowDblClick(e) {
			this.$router.push(
				`/administration/letterSenderOrganization/${e.data.id}`
			);
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
						this.$router.push(
							"/administration/letterSenderOrganization/create"
						);
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>