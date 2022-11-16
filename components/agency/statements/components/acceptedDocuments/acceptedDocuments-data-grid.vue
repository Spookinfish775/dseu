<template>
	<div>
		<DxDataGrid
			height="70vh"
			:data-source="acceptedDocuments"
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
				:file-name="$t('registrationStatement.acceptedDocuments')"
			/>
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="acceptedDocuments"
			/>
			<DxEditing
				:allow-adding="canCreate"
				:allow-updating="canUpdate"
				:allow-deleting="canUpdate"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="name"
				data-type="string"
				:caption="$t('labels.name')"
			>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="number"
				data-type="string"
				:caption="$t('labels.number')"
			>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="issueDataTime"
				data-type="date"
				:caption="$t('labels.issueDataTime')"
			>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="issuer"
				data-type="string"
				:caption="$t('labels.issuer')"
			>
				<DxRequiredRule />
			</DxColumn>
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
		DxLookup
	},
	data() {
		return {
			acceptedDocuments: []
		};
	},
	computed: {
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"OfficialDocument"
			];
			return PermissionControler.canUpdate(permission);
		},
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"OfficialDocument"
			];
			return PermissionControler.canCreate(permission);
		}
	},
	methods: {
		successedSavedApplicant(applicant) {
			let result = this.applicants.some((e, index) => {
				if (
					e.identityDocument.number ===
					applicant.identityDocument.number
				) {
					this.applicants.splice(index, 1);
					this.applicants.push(applicant);
					return true;
				}
			});
			if (!result) this.applicants.push(applicant);
			this.popupVisible = false;
		}
	}
});
</script>

