<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="payment"
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
				:file-name="$t('navigation.agency.paymentTitle')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="statements"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="prepaymentId"
				data-type="number"
				:caption="$t('labels.prepayment')"
			>
				<DxLookup
					value-expr="id"
					display-expr="statementIndex"
					:data-source="prepaymentDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="paidDateTime"
				data-type="datetime"
				:caption="$t('labels.date')"
			/>
			<DxColumn
				data-field="isRegistered"
				data-type="boolean"
				:caption="$t('labels.registered')"
			/>

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
			payment: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.payment
				})
			}),
			prepaymentDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.prepayment
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Payment"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Payment"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Payment"];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.$router.push(
							`/agency/paymentServices/payment/${e.row.data.id}`
						);
					}
				}
			];
		}
	},
	methods: {
		rowDblClick(e) {
			this.$router.push(`/agency/paymentServices/payment/${e.data.id}`);
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
						this.$router.push(`/agency/paymentServices/payment/create`);
					}
				},
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "refresh"
					},
					onClick: () => {
						this.registrationStatement.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>