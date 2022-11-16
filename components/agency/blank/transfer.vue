<template>
  <div>
    <CustomPopup
      :title="sendBlanksTitle"
      width="800px"
      height="40vh"
      ref="SendingBlanks"
    >
      <Send-blanks @successedSaved="closeSendingBlanks" />
    </CustomPopup>
    <DxDataGrid
      height="85vh"
      :data-source="blanks"
      :show-borders="true"
      :errorRowEnabled="false"
      :remote-operations="true"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :load-panel="{
        enabled: true,
        indicatorSrc: require('~/static/icons/loading.gif'),
      }"
      @selectAll="onSelected"
      @selection-changed="onSelected"
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
      <DxSelection
        select-all-mode="allPages"
        show-check-boxes-mode="onClick"
        mode="multiple"
      />
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
        :file-name="$t('navigation.agency.blankTransferTitle')"
      />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="transferBlank"
      />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="(e) => canRemove(e.row.data)"
        :useIcons="true"
        mode="row"
      />
      <DxColumn
        :visible="false"
        :allow-editing="false"
        data-field="organization.name"
        :caption="$t('labels.blankOrganization')"
      >
      </DxColumn>
      <DxColumn
        data-field="blank.number"
        data-type="number"
        :caption="$t('labels.number')"
      />
      <DxColumn
        data-field="transferType"
        data-type="number"
        cellTemplate="transferType"
        :caption="$t('labels.transferType')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="tranferTypeSource.getAll()"
        />
      </DxColumn>
      <DxColumn data-field="sender.fullName" :caption="$t('labels.sender')" />
      <DxColumn
        data-field="receiver.fullName"
        :caption="$t('labels.receiver')"
      />
      <DxColumn
        data-field="accepted"
        data-type="boolean"
        :caption="$t('labels.accepted')"
      />
      <DxColumn :width="100" :buttons="editButtons" type="buttons" />
      <template #transferType="{ data }">
        <div class="transferType__container">
          <img
            class="transferType"
            :src="tranferTypeSource.getByid(data.data.transferType).icon"
            :alt="tranferTypeSource.getByid(data.data.transferType).value"
          />
          {{ tranferTypeSource.getByid(data.data.transferType).name }}
        </div>
      </template>
      <template #acceptIcon="{ data }">
        <img
          @click="() => toAcceptBlank(data.data)"
          class="dx-link dx-link-icon"
          :src="acceptIcon"
          alt="accept"
        />
      </template>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
const acceptIcon = require("~/static/icons/agency/accept.svg");
const trashIcon = require("~/static/icons/trash.svg");
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
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";
import CustomPopup from "~/components/page/popup.vue";
import CreateBlanks from "~/components/agency/blank/create.vue";
import { BlankState } from "../../../infrastructure/data-sources/agency/blankStates";
import SendBlanks from "./send-blanks.vue";
import { confirm, alert } from "devextreme/ui/dialog";
import { DataSourceItem } from "~/infrastructure/data-sources/baseDataSource";
import { TransferType } from "~/infrastructure/data-sources/agency/transferType";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
export default Vue.extend({
  components: {
    DxSelection,
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
    CustomPopup,
    CreateBlanks,
    SendBlanks,
  },
  data() {
    return {
      selectedItems: [],
      acceptIcon,
      blanks: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.transferBlank,
        }),
      }),
    };
  },
  computed: {
    blankPermission(): number {
      const permission: number =
        this.$store.getters["user/claims"]["BlankTransfer"];
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
    tranferTypeSource() {
      return new TransferType(this);
    },
    editButtons() {
      return [
        {
          template: "acceptIcon",
          visible: (e) => this.canAccept(e.row.data),
        },
        {
          hint: this.$t("buttons.trash"),
          icon: "trash",
          visible: (e) => this.canRemove(e.row.data),
          onClick: async (e) => {
            const result = await confirm(
              this.$t("agency.confirm.deleteBlank"),
              this.$t("notifications.confirm.areYouSure")
            );
            if (result) {
              this.deleteBlanks([e.row.data.id]);
            }
          },
        },
      ];
    },
    blankStateDataSource(): DataSourceItem[] {
      const blanks = new BlankState(this).getAll();
      return blanks;
    },
    canAcceptSelectedItems(): boolean {
      return (
        this.selectedItems.length &&
        this.selectedItems.every((el) => el.canAccept) &&
        this.canUpdate
      );
    },
    canDeleteSelectedItems(): boolean {
      return (
        this.selectedItems.length &&
        this.selectedItems.every((el) => el.canDelete) &&
        this.fullAccess
      );
    },
    sendBlanksTitle(): string {
      return this.$t("agency.sendBlanks");
    },
  },
  methods: {
    closeSendingBlanks(data): void {
      if (data) this.$refs.SendingBlanks.close(data);
    },
    async deleteBlanks(blanks: number[]): Promise<void> {
      await this.$awn.asyncBlock(
        this.$axios.delete(this.$dataApi.transferBlank, {
          headers: {
            contentType: "application/json",
          },
          data: {
            blankTransferId: blanks,
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
    async acceptBlanks(blanks: number[]): Promise<void> {
      await this.$awn.asyncBlock(
        this.$axios.put(
          this.$dataApi.transferBlank,
          {
            blankTransferId: blanks,
            accepted: true,
          },
          {
            headers: {
              contentType: "application/json",
            },
          }
        ),
        () => {
          this.$awn.success();
          this.blanks.reload();
        },
        () => {
          this.$awn.alert();
        }
      );
    },
    onSelected(e): void {
      this.selectedItems = e.selectedRowsData;
    },
    canRemove(data): boolean {
      return data.canDelete && this.fullAccess;
    },
    canAccept(data): boolean {
      return data.canAccept && this.canUpdate;
    },

    reload(): void {
      this.blanks.reload();
    },
    async toAcceptBlank(data): Promise<void> {
      const result = await confirm(
        this.$t("agency.confirm.acceptBlank"),
        this.$t("notifications.confirm.areYouSure")
      );
      if (result) {
        return this.acceptBlanks([data.id]);
      }
    },
    toolbarPreparing(e): void {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            visible: this.canCreate,
            text: this.$t("buttons.transferBlank"),
            icon: require("~/static/icons/agency/transfer.svg"),
          },
          onClick: async () => {
            const test = await this.$refs.SendingBlanks.open();
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
            icon: acceptIcon,
            text: this.$t("buttons.acceptAll"),
            visible: this.canUpdate,
            onClick: async () => {
              if (!this.canAcceptSelectedItems) {
                alert(
                  this.$t("agency.alert.chooseAcceptingBlanks"),
                  this.$t("notifications.alert.warning")
                );
              } else {
                const result = await confirm(
                  this.$t("agency.confirm.acceptedSelectedBlanks"),
                  this.$t("notifications.confirm.areYouSure")
                );
                if (result) {
                  await this.acceptBlanks(
                    this.selectedItems.map((el) => el.id)
                  );
                  this.selectedItems = null;
                }
              }
            },
          },
        },
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
                  this.$t("agency.alert.chooseOutgoingBlanks"),
                  this.$t("notifications.alert.warning")
                );
              } else {
                const result = await confirm(
                  this.$t("agency.confirm.deleteSelectedBlanks"),
                  this.$t("notifications.confirm.areYouSure")
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
        {
          location: "after",
          widget: "dxButton",
          locateInMenu: "auto",
          options: {
            hint: this.$t("buttons.refresh"),
            icon: "refresh",
            onClick: () => {
              this.reload();
            },
          },
        },
        ...e.toolbarOptions.items,
      ];
    },
  },
});
</script>

<style lang="scss">
.transferType__container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.transferType {
  width: 20px;
}
</style>
