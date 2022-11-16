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
				:file-name="$t('navigation.agency.notificationTitle')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="notification"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="outgoingNumber"
				data-type="name"
				:caption="$t('labels.outgoingNumber')"
			/>
			<DxColumn
				data-field="outgoingDate"
				data-type="date"
				:caption="$t('labels.outgoingDate')"
			/>
			<DxColumn
				data-field="letterSenderOrganizationId"
				data-type="number"
				:caption="$t('labels.letterSenderOrganization')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="letterSenderOrganizationDataSource"
				/>
			</DxColumn>
      <DxColumn
        data-field="organizationId"
        data-type="number"
        :caption="$t('labels.organization')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="organizationDataSource"
        />
      </DxColumn>
        <DxColumn
        data-field="userId"
        data-type="string"
        :caption="$t('labels.user')"
      >
        <DxLookup
          value-expr="id"
          display-expr="fullName"
          :data-source="userDataSource"
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
	DxPaging,
	DxMasterDetail
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
		DxMasterDetail,
		DxPaging
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.notification
				})
			}),
			letterSenderOrganizationDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.letterSenderOrganization
			}),
      organizationDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.organization
      }),
      userDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.user
      })
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"Notification"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"Notification"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"Notification"
			];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(`/agency/notification/${e.row.data.id}`);
					}
				}
			];
		}
	},
	methods: {
		rowDblClick(e) {
			this.$router.push(`/agency/notification/${e.data.id}`);
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
						this.$router.push(`/agency/notification/create`);
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
