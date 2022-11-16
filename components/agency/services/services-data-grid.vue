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
				:file-name="$t('navigation.agency.statementsTitle')"
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
				data-field="serviceType"
				data-type="number"
				:caption="$t('labels.serviceType')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="serviceTypeDataSource"
				/>
			</DxColumn>

			<DxColumn
				data-field="enteredServiceDate"
				data-type="date"
				:caption="$t('labels.enteredServiceDate')"
				cell-template="enteredServiceDateTemplate"
			/>
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
				:caption="$t('labels.executor')"
			>
				<DxLookup
					value-expr="id"
					display-expr="fullName"
					:data-source="userDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="note"
				data-type="string"
				:caption="$t('labels.note')"
			/>

			<template #enteredServiceDateTemplate="{ data }">
				<p>{{ fomateDate(data.value) }}</p>
			</template>

			<DxColumn :width="100" :buttons="editButtons" type="buttons" />
		</DxDataGrid>

		<BasePopup :width="'70vw'" ref="applicantViewDataGrid">
			<ApplicantViewDataGrid @valueSelected="applicantSelected" />
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
import moment from "moment";

import BasePopup from "~/components/page/popup.vue";
import ApplicantViewDataGrid from "~/components/agency/statements/components/applicants/applicant-list/applicants-view-data-grid.vue";

import { ServiceType } from "~/infrastructure/enums/ServiceType";
import { ServiceTypes } from "~/infrastructure/data-sources/ServiceTypes";
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
		BasePopup,
		ApplicantViewDataGrid
	},
	data() {
		return {
			applicantId: null,
			userDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.user
			}),
			organizationDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.organization
			}),
			serviceTypeDataSource: ServiceTypes(this)
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Service"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Service"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Service"];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						let type =
							ServiceType[e.row.data.serviceType][0].toLowerCase() +
							ServiceType[e.row.data.serviceType].slice(1);
						this.$router.push(`/agency/services/${type}/${e.row.data.id}`);
					}
				}
			];
		},
		dataSource() {
			if (this.applicantId === null) {
				return new DataSource({
					store: this.$dxStore({
						key: "id",
						loadUrl: this.$dataApi.services.service
					})
				});
			} else {
				return new DataSource({
					store: this.$dxStore({
						key: "id",
						loadUrl: `${this.$dataApi.services.service}/applicant/${this.applicantId}`
					})
				});
			}
		}
	},
	methods: {
		fomateDate(value) {
			moment.locale(this.$i18n.locale);
			return `${moment(value).format("l")} ${moment(value).format("LT")}`;
		},
		applicantSelected(data) {
			this.applicantId = data.id;
			this.$refs.applicantViewDataGrid.close();
		},
		rowDblClick(e) {
			let type =
				ServiceType[e.data.serviceType][0].toLowerCase() +
				ServiceType[e.data.serviceType].slice(1);
			this.$router.push(`/agency/services/${type}/${e.data.id}`);
		},
		toolbarPreparing(e) {
			e.toolbarOptions.items = [
				{
					location: "after",
					widget: "dxDropDownButton",
					options: {
						icon: "plus",
						visible: this.canCreate,
						displayExpr: "name",
						dropDownOptions: { width: 230 },
						items: ServiceTypes(this),
						onItemClick: e => {
							let type =
								ServiceType[e.itemData.id][0].toLowerCase() +
								ServiceType[e.itemData.id].slice(1);
							this.$router.push(`/agency/services/${type}/create`);
						}
					}
				},
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "refresh"
					},
					onClick: () => {
						this.applicantId = null;
						this.dataSource.reload();
					}
				},
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "user"
					},
					onClick: () => {
						this.$refs.applicantViewDataGrid.open();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>