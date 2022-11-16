<template>
	<div>
		<DxDataGrid
			height="70vh"
			:data-source="applicants"
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
				storage-key="applicants"
			/>
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="canUpdate"
				:useIcons="true"
				mode="form"
			/>

			<DxColumn
				data-field="applicantType"
				data-type="number"
				:caption="$t('labels.applicantType')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="applicantTypeDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="name"
				data-type="string"
				:caption="$t('labels.name')"
			>
			</DxColumn>
			<DxColumn
				data-field="firstName"
				data-type="string"
				:caption="$t('labels.firstName')"
			>
			</DxColumn>
			<DxColumn
				data-field="lastName"
				data-type="string"
				:caption="$t('labels.lastName')"
			>
			</DxColumn>
			<DxColumn
				data-field="middleName"
				data-type="string"
				:caption="$t('labels.middleName')"
			>
			</DxColumn>
			<DxColumn
				data-field="birthday"
				data-type="date"
				:caption="$t('labels.dateOfBirth')"
			>
			</DxColumn>
			<DxColumn
				data-field="placeOfBirth"
				data-type="date"
				:caption="$t('labels.placeOfBirth')"
			>
			</DxColumn>
			<DxColumn
				data-field="citizenshipId"
				data-type="number"
				:caption="$t('labels.citizenship')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="citizenshipDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="registration"
				data-type="string"
				:caption="$t('labels.registration')"
			>
			</DxColumn>
			<DxColumn data-field="tin" data-type="string" :caption="$t('labels.tin')">
			</DxColumn>
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

		<BasePopup ref="basePopup" width="70vw" height="70vh" position="top">
			<ApplicantCard
				:data="currentApplicant"
				@successedSaved="successedSavedApplicant"
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

import ApplicantCard from "~/components/agency/statements/components/applicants/applicant-card.vue";

import BasePopup from "~/components/page/popup.vue";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { ApplicantTypes } from "~/infrastructure/data-sources/ApplicantTypes";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

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
		DxLookup,
		BasePopup,
		ApplicantCard
	},
	data() {
		return {
			applicants: [],
			currentApplicant: null,
			applicantTypeDataSource: ApplicantTypes(this),
			citizenshipDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.citizenship
			}),
			statusDataSource: Statuses(this)
		};
	},
	computed: {
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.currentApplicant = e.row.data;
						this.$refs["basePopup"].open();
					}
				},
				"delete"
			];
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"UserClaimRoleRegistration"
			];
			return PermissionControler.canUpdate(permission);
		},
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"UserClaimRoleRegistration"
			];
			return PermissionControler.canCreate(permission);
		}
	},
	methods: {
		rowDblClick(e) {
			this.currentApplicant = e.data;
			this.$refs["basePopup"].open();
		},
		successedSavedApplicant(applicant) {
			let result = this.applicants.some((e, index) => {
				if (e.identityDocument.number === applicant.identityDocument.number) {
					this.applicants.splice(index, 1);
					this.applicants.push(applicant);
					return true;
				}
			});
			if (!result) this.applicants.push(applicant);
			this.$refs["basePopup"].close();
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
						this.$refs["basePopup"].open();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>

