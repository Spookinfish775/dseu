<template>
	<div>
		<DxDataGrid
			height="80vh"
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
				:allow-deleting="false"
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
				data-field="birthday"
				data-type="date"
				:caption="$t('labels.dateOfBirth')"
			/>
			<DxColumn
				data-field="placeOfBirth"
				data-type="date"
				:caption="$t('labels.placeOfBirth')"
			/>
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
			/>
			<DxColumn
				data-field="tin"
				data-type="string"
				:caption="$t('labels.tin')"
			/>

			<DxColumn
				data-field="identityDocument"
				data-type="object"
				:caption="$t('labels.identityDocument')"
			>
				<DxColumn
					data-field="identityDocument.issueDate"
					data-type="string"
					:caption="$t('labels.identityDocumentIssueDate')"
				/>
				<DxColumn
					data-field="identityDocument.issuedBy"
					data-type="string"
					:caption="$t('labels.identityDocumentIssuedBy')"
				/>
				<DxColumn
					data-field="identityDocument.series"
					data-type="string"
					:caption="$t('labels.identityDocumentSeries')"
				/>
				<DxColumn
					data-field="identityDocument.number"
					data-type="string"
					:caption="$t('labels.number')"
				/>
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
			<DxColumn
				data-field="fullInformation"
				data-type="string"
				:caption="$t('labels.fullInformation')"
			>
				<DxLookup />
			</DxColumn>
			<DxColumn :width="100" :buttons="editButtons" type="buttons" />
		</DxDataGrid>

		<BasePopup ref="applicantPopup" width="70vw" height="80vh" position="top">
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
import { DxScrollView } from "devextreme-vue/scroll-view";
import DataSource from "devextreme/data/data_source";
import { confirm } from "devextreme/ui/dialog";

import BasePopup from "~/components/page/popup.vue";
import ApplicantCard from "~/components/agency/statements/components/applicants/applicant-card.vue";

import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { Status } from "~/infrastructure/enums/Status";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
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
		DxScrollView,
		ApplicantCard
	},
	props: {
		filter: {
			type: Array,
			default: null
		}
	},
	data() {
		return {
			citizenshipDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.citizenship
			}),
			ApplicantType,
			applicantTypeDataSource: ApplicantTypes(this),
			statusDataSource: Statuses(this),
			currentApplicant: null,
			isCard: false
		};
	},
	computed: {
		applicants() {
			let filter = ["status", "<>", Status.Closed];
			if (this.filter) {
				filter = [filter, "and", this.filter];
			}
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.applicant,
					insertUrl: this.$dataApi.applicant
				}),
				filter
			});
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.choose"),
					icon: "check",
					onClick: e => {
						this.$emit("valueSelected", e.row.data);
					}
				},
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						this.currentApplicant = e.row.data;
						this.$refs["applicantPopup"].open();
					}
				},
				{
					hint: this.$t("buttons.trash"),
					icon: "trash",
					onClick: async e => {
						const result = await confirm(
							this.$t("notifications.confirm.areYouSure"),
							this.$t("notifications.confirm.index")
						);
						if (result) {
							this.deleteApplicant(e.row.data.id);
						}
					}
				}
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
			this.$emit("valueSelected", e.data);
		},
		successedSavedApplicant(applicant) {
			this.$emit("valueSelected", applicant);
			this.applicants.reload();
			this.$refs["applicantPopup"].close();
		},
		successedCreatedApplicant(applicant) {
			this.$emit("valueSelected", applicant);
			this.applicants.reload();
			this.$refs["applicantPopup"].close();
		},
		toolbarPreparing(e) {
			e.toolbarOptions.items = [...e.toolbarOptions.items];
		},
		async deleteApplicant(applicantId) {
			await this.$awn.asyncBlock(
				this.$axios.delete(`${this.$dataApi.applicant}/${applicantId}`),
				e => {
					this.$awn.success();
					this.$emit("successedDeleted");
				},
				e => {
					this.$awn.alert();
				}
			);
		}
	}
});
</script>

