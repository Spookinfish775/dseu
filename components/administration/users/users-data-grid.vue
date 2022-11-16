<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="users"
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
				:file-name="$t('navigation.administration.usersTitle')"
			/>
			<DxStateStoring :enabled="true" type="localStorage" storage-key="user" />
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="firstName"
				data-type="string"
				:caption="$t('labels.firstName')"
			/>
			<DxColumn
				data-field="lastName"
				data-type="string"
				:caption="$t('labels.lastName')"
			/>
			<DxColumn
				data-field="middleName"
				data-type="string"
				:caption="$t('labels.middleName')"
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
	data() {
		return {
			users: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.user
				}),
				filter: ["firstName", "<>", "Administrator"]
			}),
			statusDataSource: Statuses(this),
			editButtons: [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(`/administration/users/${e.row.data.id}`);
					}
				}
			]
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["User"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["User"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["User"];
			return PermissionControler.fullAccess(permission);
		}
	},
	methods: {
		rowDblClick(e) {
			this.$router.push(`/administration/users/${e.data.id}`);
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
						this.$router.push(`/administration/users/create`);
					}
				},
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "refresh"
					},
					onClick: () => {
						this.users.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>