<template>
	<div>
		<DxDataGrid
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
				:file-name="$t('navigation.realEstate.title')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="realEstate"
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
				data-field="index"
				data-type="number"
				:caption="$t('labels.number')"
			/>
			<DxColumn
				data-field="dateTime"
				data-type="datetime"
				:caption="$t('labels.date')"
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

			<DxColumn :width="70" :buttons="editButtons" type="buttons" />
		</DxDataGrid>
		<BasePopup ref="statementsPopup" width="70vw" height="70vh">
			<component
				:is="statementType"
				:data="currentStatement"
				:readOnly="true"
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

import BasePopup from "~/components/page/popup.vue";
import RealEstateCard from "~/components/realEstate/realEstate-card.vue";

//Statemets
import RegistrationStatement from "~/components/agency/statements/registrationStatement/card.vue";
import SuspendStatement from "~/components/agency/statements/suspendStatement/card.vue";

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
		RealEstateCard,
		RegistrationStatement,
		SuspendStatement
	},
	props: {
		valueExpr: {
			type: String,
			default: "id"
		},
		filter: {
			type: Array,
			default: null
		}
	},
	data() {
		return {
			currentStatement: null,
			statementType: null,
			statements: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.statements.statement
				}),
				filter: this.filter
			}),
			realEstateDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.realEstate
			}),
			lawDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.law
			}),
			userDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.user
			}),
			statementTypeDataSource: StatementTypes(this),
			decisionDataSource: DecisionStatuses(this)
		};
	},
	computed: {
		editButtons() {
			return [
				{
					hint: this.$t("labels.choose"),
					icon: "check",
					onClick: e => {
						this.$emit("valueSelected", e.row.data[this.valueExpr]);
					}
				},
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.currentStatement = e.row.data;
						this.statementType = StatementType[e.row.data.statementType];
						this.$refs["statementsPopup"].open();
					}
				}
			];
		},
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"UserRegistration"
			];
			return PermissionControler.canCreate(permission);
		}
	},
	methods: {
		rowDblClick(e) {
			this.$emit("valueSelected", e.data[this.valueExpr]);
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
						this.statements.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>