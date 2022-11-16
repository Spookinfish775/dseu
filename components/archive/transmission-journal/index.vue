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
			@init-new-row="initNewRow"
			@row-updating="rowUpdating"
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
			<DxStateStoring
				:enabled="true"
				type="localStorage"
				storage-key="transmission-journal"
			/>

			<DxEditing
				:allow-adding="canCreate"
				:allow-updating="canUpdate"
				:allow-deleting="fullAccess"
				:useIcons="true"
				mode="row"
			/>

			<DxColumn
				data-field="archiveId"
				data-type="number"
				:caption="$t('labels.archive')"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="archiveDataSource"
				/>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="givenCaseId"
				data-type="number"
				:caption="$t('labels.givenCaseId')"
			>
				<DxLookup
					value-expr="id"
					display-expr="caseNumber"
					:data-source="caseDataSource"
				/>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="whoTookId"
				data-type="string"
				:caption="$t('labels.whoTookId')"
			>
				<DxLookup
					value-expr="id"
					display-expr="fullName"
					:data-source="userDataSource"
				/>
				<DxRequiredRule />
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
				data-field="note"
				data-type="string"
				:caption="$t('labels.note')"
			/>
			<DxColumn
				data-field="isInArchive"
				data-type="boolean"
				:caption="$t('labels.isInArchive')"
				:editorOptions="readOnlyOptions"
			/>
			<DxColumn
				data-field="confirmed"
				data-type="boolean"
				:caption="$t('labels.confirmed')"
				:editorOptions="readOnlyOptions"
			/>
			<DxColumn
				data-field="givenDate"
				data-type="date"
				:caption="$t('labels.givenDate')"
				:editorOptions="readOnlyOptions"
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
	DxScrolling,
	DxRequiredRule,
	DxStateStoring,
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
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { Status } from "~/infrastructure/enums/Status";
export default Vue.extend({
	components: {
		DxSearchPanel,
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxScrolling,
		DxRequiredRule,
		DxStateStoring,
		DxFilterRow,
		DxLookup,
		DxPaging,
		DxHeaderFilter,
		DxGrouping,
		DxGroupPanel,
		DxExport,
		DxColumnChooser,
		DxColumnFixing
	},
	props: {
		archiveId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: `${this.$dataApi.transmissionJournal}`,
					updateUrl: this.$dataApi.transmissionJournal,
					removeUrl: this.$dataApi.transmissionJournal,
					insertUrl: this.$dataApi.transmissionJournal
				})
			}),
			archiveDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.archive
			}),
			userDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.user
			})
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["TransmissionJournal"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["TransmissionJournal"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["TransmissionJournal"];
			return PermissionControler.fullAccess(permission);
		},
		caseDataSource() {
			return this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.userCase
			});
		},
		statusDataSource() {
			return Statuses(this);
		},
		readOnlyOptions() {
			return {
				readOnly: true
			};
		},
		editButtons() {
			return [
				{
					visible: e =>
						!e.row.data.confirmed &&
						e.row.data.whoTookId === this.$store.getters["user/id"],
					hint: this.$t("labels.check"),
					icon: "check",
					onClick: async e => {
						await this.$axios.post(this.$dataApi.confirmation, {
							transmissionJournalId: e.row.key
						});
						this.dataSource.reload();
					}
				},
				{
					name: "edit",
					hint: this.$t("labels.edit"),
					icon: "edit"
				},
				{
					name: "delete"
				}
			];
		}
	},
	methods: {
		initNewRow(e): void {
			e.data.status = Status.Active;
		},
		rowUpdating(e) {
			e.newData = Object.assign(e.oldData, e.newData);
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
						this.dataSource.reload();
					}
				},
				...e.toolbarOptions.items
			];
		}
	}
});
</script>
