<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="statements"
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
				data-field="statementType"
				data-type="number"
				:caption="$t('labels.statementType')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="statementTypeDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="decision"
				data-type="number"
				:caption="$t('labels.decision')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="decisionDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="index"
				data-type="string"
				:caption="$t('labels.number')"
			/>
			<DxColumn
				data-field="enteredStatementDate"
				data-type="date"
				:caption="$t('labels.enteredStatementDate')"
				cell-template="enteredStatementDateTemplate"
			/>
      <DxColumn
        data-field="owners"
        data-type="string"
        :caption="$t('labels.owners')"
      />
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
				data-field="lawId"
				data-type="number"
				:caption="$t('labels.law')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="lawDataSource"
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
			<template #enteredStatementDateTemplate="{ data }">
				<p>{{ fomateDate(data.value) }}</p>
			</template>

			<DxColumn :width="100" :buttons="editButtons" type="buttons" />
		</DxDataGrid>
		<PaymentPopup ref="paymentPopup" :document="currentSelectedRow" />
		<BasePopup :width="'70vw'" ref="applicantViewDataGrid">
			<ApplicantViewDataGrid
				:filter="[
					'applicantType',
					'<>',
					ApplicantType.LetterSenderOrganization
				]"
				@valueSelected="applicantSelected"
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
import moment from "moment";

import BasePopup from "~/components/page/popup.vue";
import ApplicantViewDataGrid from "~/components/agency/statements/components/applicants/applicant-list/applicants-view-data-grid.vue";
import PaymentPopup from "~/components/agency/statements/components/payment-service/payment-popup.vue";

import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { DecisionStatuses } from "~/infrastructure/data-sources/DecisionStatuses";
import { StatementType } from "~/infrastructure/enums/StatementType";
import { StatementTypes } from "~/infrastructure/data-sources/StatementTypes";
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
		PaymentPopup,
		ApplicantViewDataGrid
	},
	data() {
		return {
			applicantId: null,
			userDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.user
			}),
			realEstateDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.realEstate
			}),
			lawDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.law
			}),
			ApplicantType,
			decisionDataSource: DecisionStatuses(this),
			statementTypeDataSource: StatementTypes(this),
			currentSelectedRow: {}
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Statement"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Statement"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Statement"];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("navigation.agency.createPrepaymentTitle"),
					icon: "money",
					onClick: e => {
						this.currentSelectedRow = e.row.data;
						this.$refs["paymentPopup"].open();
					}
				},
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						let type =
							StatementType[e.row.data.statementType][0].toLowerCase() +
							StatementType[e.row.data.statementType].slice(1);
						this.$router.push(`/agency/statements/${type}/${e.row.data.id}`);
					}
				}
			];
		},
		statements() {
			if (this.applicantId === null) {
				return new DataSource({
					store: this.$dxStore({
						key: "id",
						loadUrl: this.$dataApi.statements.statement
					})
				});
			} else {
				return new DataSource({
					store: this.$dxStore({
						key: "id",
						loadUrl: `${this.$dataApi.statements.statement}/applicant/${this.applicantId}`
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
		rowDblClick(e) {
			let type =
				StatementType[e.data.statementType][0].toLowerCase() +
				StatementType[e.data.statementType].slice(1);
			this.$router.push(`/agency/statements/${type}/${e.data.id}`);
		},
		applicantSelected(data) {
			this.applicantId = data.id;
			this.$refs.applicantViewDataGrid.close();
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
						items: StatementTypes(this),
						onItemClick: e => {
							let type =
								StatementType[e.itemData.id][0].toLowerCase() +
								StatementType[e.itemData.id].slice(1);
							this.$router.push(`/agency/statements/${type}/create`);
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
						this.statements.reload();
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
