<template>
	<div>
		<CustomPopup
			:title="$t('agency.createBlanks')"
			width="800px"
			height="30vh"
			ref="CreatingBlanks"
		>
			<Create-blanks @successedSaved="closeCreatingBlanks" />
		</CustomPopup>
		<DxDataGrid
			@selectAll="onSelected"
			@selection-changed="onSelected"
			@row-updating="updateRow"
			ref="gridBlank"
			height="85vh"
			:data-source="blanks"
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
				:file-name="$t('navigation.agency.blankTitle')"
			/>
			<DxSelection
				select-all-mode="allPages"
				show-check-boxes-mode="onClick"
				mode="multiple"
			/>
			<DxStateStoring :enabled="true" type="localStorage" storage-key="blank" />
			<DxEditing
				:allow-adding="false"
				:allow-updating="e => canUpdateState(e.row.data)"
				:allow-deleting="true"
				:useIcons="true"
				mode="row"
			/>

      <DxColumn
        :allow-editing="false"
        data-field="number"
        data-type="number"
        :caption="$t('labels.number')"
      />
      <DxColumn
        :allow-editing="false"
        data-field="organization.name"
        :caption="$t('labels.organization')"
      >
      </DxColumn>
      <DxColumn
        :allow-editing="false"
        data-field="owner.fullName"
        :caption="$t('labels.owner')"
      >
      </DxColumn>

      <DxColumn
        cellTemplate="destroyed"
        :allow-editing="false"
        data-field="isDestroyed"
        :caption="$t('labels.destroyed')"
      >
      </DxColumn>
      <DxColumn
        editCellTemplate="cellTemplate"
        data-field="blankState"
        :caption="$t('labels.blankState')"
      >
        <DxLookup
          display-expr="name"
          value-expr="id"
          :data-source="blankStateDataSource"
        />
      </DxColumn>
      <DxColumn
        :allow-editing="false"
        width="50px"
        data-field="isSent"
        cellTemplate="isSentComponent"
        data-type="boolean"
        :caption="$t('labels.isSent')"
      >
      </DxColumn>

			<template #destroyed="{ data }">
				<div v-if="data.data.isDestroyed">
					<img class="dx-icon-grid" :src="destroyedIcon" alt="destroyed" />
				</div>
			</template>
			<DxColumn :width="100" :buttons="editButtons" type="buttons" />
			<template #isSentComponent="{ data }">
				<div v-if="data.data.isSent">
					<img class="dx-icon-grid" :src="isSent" alt="Sending" />
				</div>
			</template>
			<template #cellTemplate="{ data: cellInfo }">
				<DxSelectBox
					ref="selectBox"
					value-expr="id"
					display-expr="name"
					:data-source="updateBlankStateDataSource"
					:value="cellInfo.value"
					:showClearButton="true"
					:search-enabled="true"
					search-expr="name"
					@value-changed="value => updateBlankState(value, cellInfo)"
				/>
			</template>
			<DxSummary>
				<DxTotalItem
					column="number"
					summary-type="count"
					value-format="decimal"
				/>
			</DxSummary>
		</DxDataGrid>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
const isSent = require("~/static/icons/agency/isSent.svg");
const trashIcon = require("~/static/icons/trash.svg");
const defected_damaged = require("~/static/icons/agency/defected-damaged.svg");
const destroyedIcon = require("~/static/icons/destroyed.svg");
import { DxSelectBox } from "devextreme-vue/select-box";
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
	DxSelection,
	DxSummary,
	DxTotalItem
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import CustomPopup from "~/components/page/popup.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import CreateBlanks from "~/components/agency/blank/create.vue";
import { BlankState } from "../../../infrastructure/data-sources/agency/blankStates";
import SendBlanks from "./send-blanks.vue";
import { confirm, alert } from "devextreme/ui/dialog";
import { blankState } from "../../../infrastructure/enums/agency/blankState";
import { DataSourceItem } from "~/infrastructure/data-sources/baseDataSource";
export default Vue.extend({
  components: {
    DxSelectBox,
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
    DxSelection,
    CustomPopup,
    CreateBlanks,
    SendBlanks,
    DxSummary,
    DxTotalItem,
  },
  data() {
    return {
      selectedItems: [],
      isSent,
      defected_damaged,
      destroyedIcon,
      blanks: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.blank,
          updateUrl: this.$dataApi.blank,
        }),
      }),
    };
  },
  computed: {
    canDeleteSelectedItems(): boolean {
      return (
        this.selectedItems.length &&
        this.selectedItems.every((el) => el.blankState === blankState.Empty)
      );
    },
    editButtons() {
      return [
        {
          hint: this.$t("buttons.defected_damaged"),
          icon: defected_damaged,
          cssClass: "dx-link dx-link-icon",
          name: "edit",
        },
        {
          hint: this.$t("buttons.trash"),
          icon: "trash",
          visible: (e) => this.canDelete(e.row.data),
          onClick: async (e) => {
            const result = await confirm(
              this.$t("agency.confirm.deleteBlank"),
              this.$t("confirm.areYouSure")
            );
            if (result) {
              this.deleteBlanks([e.row.data.id]);
            }
          },
        },
      ];
    },
    updateBlankStateDataSource(): DataSourceItem[] {
      const blanks = new BlankState(this)
        .disabledAllExpext([
          blankState.Damaged,
          blankState.Defected,
          blankState.Empty,
        ])
        .getAll();
      return blanks;
    },
    blankStateDataSource(): DataSourceItem[] {
      const blanks = new BlankState(this).getAll();
      return blanks;
    },
    createBlanksTitle(): string {
      return this.$t("agency.createBlanks");
    },
    blankPermission(): number {
      let permission: number = this.$store.getters["user/claims"]["Blank"];
      return permission;
    },
    canCreate(): boolean {
      return PermissionControler.canCreate(this.blankPermission);
    },
    fullAccess(): boolean {
      return PermissionControler.fullAccess(this.blankPermission);
    },
    canUpdate(): boolean {
      return PermissionControler.canUpdate(this.blankPermission);
    },
    myId() {
      return this.$store.getters["user/id"];
    },
  },
  methods: {
    onSelected(e): void {
      this.selectedItems = e.selectedRowsData;
    },
    updateBlankState(e, cellInfo): void {
      cellInfo.setValue(e.value);
      cellInfo.component.updateDimensions();
    },
    updateRow(e) {
      e.newData.id = e.oldData.id;
    },
    canUpdateState(data): boolean {
      return (
        !data.isSent &&
        !data.isDestroyed &&
        (data.blankState === blankState.Empty ||
          data.blankState === blankState.Damaged ||
          data.blankState === blankState.Defected) &&
        data.owner?.id === this.myId &&
        this.canUpdate
      );
    },
    async deleteBlanks(blanks: number[]): Promise<void> {
      await this.$awn.asyncBlock(
        this.$axios.delete(this.$dataApi.blank, {
          headers: {
            contentType: "application/json",
          },
          data: {
            blankId: blanks,
          },
        }),
        () => {
          this.$awn.success();
          this.blanks.reload();
        },
        () => {
          this.$awn.alert();
        }
      );
    },
    canDelete(data): boolean {
      return (
        !data.isSent &&
        !data.isDestroyed &&
        data.blankState === blankState.Empty &&
        data.owner?.id === this.myId &&
        this.fullAccess
      );
    },
    modeSelection(e): string {
      return "always";
    },
    closeCreatingBlanks(data): void {
      if (data) this.$refs.CreatingBlanks.close(data);
    },
    reload(): void {
      this.blanks.reload();
    },
    toolbarPreparing(e): void {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          locateInMenu: "auto",
          options: {
            icon: "plus",
            visible: this.canCreate,
          },
          onClick: async () => {
            const test = await this.$refs.CreatingBlanks.open();
            if (test) {
              this.reload();
            }
          },
        },
        {
          location: "after",
          widget: "dxButton",
          locateInMenu: "auto",
          options: {
            icon: "refresh",
          },
          onClick: () => {
            this.reload();
          },
        },
        ...e.toolbarOptions.items,
        {
          location: "after",
          widget: "dxButton",
          locateInMenu: "auto",
          options: {
            icon: trashIcon,
            visible: this.fullAccess,
            text: this.$t("buttons.deleteAll"),
            onClick: async () => {
              if (!this.canDeleteSelectedItems) {
                alert(
                  this.$t("agency.alert.chooseEmptyBlanks"),
                  this.$t("alert.warning")
                );
              } else {
                const result = await confirm(
                  this.$t("agency.confirm.deleteSelectedBlanks"),
                  this.$t("confirm.areYouSure")
                );
                if (result) {
                  await this.deleteBlanks(
                    this.selectedItems.map((el) => el.id)
                  );
                  this.selectedItems = null;
                }
              }
            },
          },
        },
      ];
    },
  },
});
</script>

<style scoped>
.dx-icon-grid {
	width: 20px;
	height: 20px;
}
</style>
