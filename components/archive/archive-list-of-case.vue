<template>
	<div>
		<DxDataGrid
			height="80vh"
			:data-source="dataSource"
			:show-borders="true"
			:errorRowEnabled="false"
			:remote-operations="true"
			:allow-column-reordering="true"
			:allow-column-resizing="true"
			:column-auto-width="true"
			:load-panel="{
				enabled: true,
				indicatorSrc: require('~/static/icons/loading.gif')
			}"
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
				:file-name="$t('navigation.caseBlock.title')"
			/>
			<DxStateStoring :enabled="true" type="localStorage" storage-key="case" />
			<DxEditing
				:allow-adding="false"
				:allow-updating="false"
				:allow-deleting="false"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="caseNumber"
				data-type="string"
				:caption="$t('labels.caseNumber')"
			/>
			<DxColumn
				data-field="branchId"
				data-type="number"
				:group-index="1"
				:caption="$t('labels.branch')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="branchDataSource"
				/>
			</DxColumn>
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
				data-field="realEstateType"
				data-type="number"
				:caption="$t('labels.realEstateType')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="realEstateTypeDataSource"
				/>
			</DxColumn>
			<DxColumn
				data-field="openDate"
				data-type="date"
				:caption="$t('labels.openDate')"
			/>
			<DxColumn
				data-field="closeDate"
				data-type="date"
				:caption="$t('labels.closeDate')"
			/>

			<DxColumn :width="100" :buttons="editButtons" type="buttons" />

			<DxMasterDetail :enabled="true" template="masterDetailTemplate" />
			<template #masterDetailTemplate="{data}">
				<MasterDetailTemplate :data="data.data" />
			</template>
			<BasePopup
				ref="realEstatePopup"
				width="70vw"
				height="70vh"
				:show-title="true"
				:title="$t('navigation.realEstate.title')"
			>
				<RealEstateCard :data="currentRealEstate" :readOnly="true" />
			</BasePopup>
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
	DxLookup,
	DxPaging,
	DxHeaderFilter,
	DxGrouping,
	DxGroupPanel,
	DxExport,
	DxColumnChooser,
	DxColumnFixing
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import RealEstateCard from "~/components/realEstate/realEstate-card.vue";
import MasterDetailTemplate from "~/components/case/master-detail-template.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
import { ArchiveStatus } from "~/infrastructure/enums/Status";
export default Vue.extend({
	components: {
		BasePopup,
		DxSearchPanel,
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxScrolling,
		DxRequiredRule,
		DxStateStoring,
		DxMasterDetail,
		DxFilterRow,
		DxLookup,
		DxPaging,
		DxHeaderFilter,
		DxGrouping,
		DxGroupPanel,
		DxExport,
		DxColumnChooser,
		DxColumnFixing,
		MasterDetailTemplate,
		RealEstateCard
	},
	props: {
		archiveId: Number
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.case
				}),
				filter: [
					["archiveStatus", "=", ArchiveStatus.InArchive],
					"and",
					["archiveId", "=", this.archiveId]
				]
			}),
			branchDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.organization
			}),
			realEstateDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.realEstate
			}),
			realEstateTypeDataSource: RealEstateTypes(this),
			currentRealEstate: null
		};
	},
	computed: {
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
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"UserClaimRoleRegistration"
			];
			return PermissionControler.fullAccess(permission);
		},
		editButtons() {
			return [
				{
					hint: this.$t("labels.detail"),
					icon: "info",
					onClick: e => {
						if (e.row.data.realEstateId === this.currentRealEstate?.id) {
							this.$refs["realEstatePopup"].open();
						} else {
							this.$awn.asyncBlock(
								this.$axios.get(
									`${this.$dataApi.realEstate}/${e.row.data.realEstateId}`
								),
								e => {
									this.currentRealEstate = e.data;
									this.$refs["realEstatePopup"].open();
								},
								e => {
									this.$awn.alert();
								}
							);
						}
					}
				},
				{
					hint: this.$t("labels.edit"),
					icon: "edit",
					onClick: e => {
						this.$router.push(`/realEstate/${e.row.data.realEstateId}`);
					}
				}
			];
		}
	},
	methods: {
		toolbarPreparing(e) {
			e.toolbarOptions.items = [
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
				{
					location: "after",
					widget: "dxButton",
					options: {
						icon: "verticalaligntop"
					},
					onClick: () => {
						this.$router.push(`/archive/transmissionJournal/${this.archiveId}`);
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>
