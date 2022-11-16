<template>
  <div>
    <CustomPopup
      :title="createActTitle"
      width="800px"
      height="70vh"
      ref="CreatingAct"
    >
      <Create-destroy-act @successedSaved="closeCreatingDestroyAct" />
    </CustomPopup>
    <DxDataGrid
      ref="gridBlank"
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
        :file-name="$t('navigation.agency.destroyedAct')"
      />
      <DxStateStoring :enabled="true" type="localStorage" storage-key="blank" />
      <DxEditing
        :allow-adding="false"
        :allow-updating="(e) => canUpdate"
        :allow-deleting="true"
        :useIcons="true"
        mode="row"
      />
      <DxColumn data-field="actNumber" :caption="$t('labels.number')" />
      <DxColumn
        data-type="date"
        data-field="actDate"
        :caption="$t('labels.date')"
      >
      </DxColumn>
      <DxColumn
        data-field="blankDestroyer.fullName"
        :caption="$t('labels.blankDestroyer')"
      >
      </DxColumn>
      <DxColumn
        :calculateCellValue="blankCalculate"
        data-field="blanks"
        :caption="$t('labels.blanks')"
      >
      </DxColumn>
      <DxColumn data-field="actNote" :caption="$t('labels.note')"> </DxColumn>
      <DxColumn :width="100" :buttons="editButtons" type="buttons" />
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateDestroyAct from "./create-destroy-act.vue";
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
  DxTotalItem,
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";
import CustomPopup from "~/components/page/popup.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { confirm, alert } from "devextreme/ui/dialog";

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
    DxSummary,
    DxTotalItem,
    CreateDestroyAct,
  },
  data() {
    return {
      blanks: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.blankDestroy,
        }),
      }),
    };
  },
  computed: {
    createActTitle(): string {
      return this.$t("agency.createDestroyedActTitle");
    },

    editButtons() {
      return [
        {
          hint: this.$t("buttons.trash"),
          icon: "trash",
          visible: (e) => this.fullAccess,
          onClick: async (e) => {
            const result = await confirm(
              this.$t("notifications.confirm.delete"),
              this.$t("notifications.confirm.accepting")
            );
            if (result) {
              this.deleteDestroyedAct([e.row.data.id]);
            }
          },
        },
      ];
    },
    blankPermission(): number {
      let permission: number =
        this.$store.getters["user/claims"]["BlankDestroy"];
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
    closeCreatingDestroyAct(data): void {
      if (data) {
        this.$refs.CreatingAct.close(data);
      }
    },
    blankCalculate(rowData) {
      return rowData.blanks.map((blank) => blank.number);
    },
    async deleteDestroyedAct(actId: number): Promise<void> {
      await this.$awn.asyncBlock(
        this.$axios.delete(`${this.$dataApi.blankDestroy}/${actId}`),
        () => {
          this.$awn.success();
          this.reload();
        },
        () => {
          this.$awn.alert();
        }
      );
    },
    closeCreatingAct(data): void {
      if (data) this.$refs.CreatingAct.close(data);
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
            text: this.$t("agency.buttons.createAct"),
            visible: this.canCreate,
          },
          onClick: async () => {
            const test = await this.$refs.CreatingAct.open();
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
            hint: this.$t("buttons.refresh"),
            icon: "refresh",
          },
          onClick: () => {
            this.reload();
          },
        },
        ...e.toolbarOptions.items,
      ];
    },
  },
});
</script>
