<template>
  <div>
    <DxDataGrid
      height="80vh"
      :data-source="dataSource"
      :show-borders="true"
      :hoverStateEnabled="true"
      :errorRowEnabled="false"
      :remote-operations="true"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :load-panel="{
        enabled: true,
        indicatorSrc: require('~/static/icons/loading.gif'),
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
        :file-name="$t('navigation.administration.refusalReasonTitle')"
      />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="refusalReason"
      />
      <DxEditing
        :allow-adding="canCreate"
        :allow-updating="canUpdate"
        :allow-deleting="fullAccess"
        :useIcons="true"
        mode="form"
      />

      <DxColumn
        data-field="name"
        data-type="string"
        :caption="$t('labels.name')"
      >
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="content"
        data-type="string"
        :caption="$t('labels.content')"
      >
        <DxFormItem
          :col-span="2"
          :editor-options="{ height: 100 }"
          editor-type="dxTextArea"
        />
        <DxRequiredRule />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxDataGrid,
  DxSearchPanel,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxStateStoring,
  DxRequiredRule,
  DxFilterRow,
  DxPaging,
  DxLookup,
  DxHeaderFilter,
  DxGrouping,
  DxGroupPanel,
  DxExport,
  DxColumnChooser,
  DxColumnFixing,
  DxFormItem,
} from "devextreme-vue/data-grid";
import "devextreme-vue/text-area";
import DataSource from "devextreme/data/data_source";

import { Status } from "~/infrastructure/enums/Status";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxDataGrid,
    DxSearchPanel,
    DxColumn,
    DxEditing,
    DxScrolling,
    DxStateStoring,
    DxRequiredRule,
    DxFilterRow,
    DxPaging,
    DxLookup,
    DxHeaderFilter,
    DxGrouping,
    DxGroupPanel,
    DxExport,
    DxColumnChooser,
    DxColumnFixing,
    DxFormItem,
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.refusalReason,
          insertUrl: this.$dataApi.refusalReason,
          removeUrl: this.$dataApi.refusalReason,
          updateUrl: this.$dataApi.refusalReason,
        }),
      }),
      statusDataSource: Statuses(this),
    };
  },
  computed: {
    canCreate() {
      let permission: number =
        this.$store.getters["user/claims"]["RefusalReason"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number =
        this.$store.getters["user/claims"]["RefusalReason"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number =
        this.$store.getters["user/claims"]["RefusalReason"];
      return PermissionControler.fullAccess(permission);
    },
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
            icon: "refresh",
          },
          onClick: () => {
            this.dataSource.reload();
          },
        },
        ...e.toolbarOptions.items,
      ];
    },
  },
});
</script>
