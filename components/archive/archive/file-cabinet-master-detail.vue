<template>
  <div>
    <DxTreeList
      height="400"
      :data-source="dataSource"
      :show-borders="true"
      :hoverStateEnabled="true"
      :errorRowEnabled="false"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      parent-id-expr="parentId"
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
      <DxColumnChooser :enabled="true" />
      <DxColumnFixing :enabled="true" />
      <DxSearchPanel position="after" :visible="true" />
      <DxScrolling mode="virtual" />
      <DxPaging :enabled="true" :page-size="10" />

      <DxStateStoring :enabled="true" type="localStorage" storage-key="case" />
      <DxEditing
        :allow-adding="canCreate"
        :allow-updating="canUpdate"
        :allow-deleting="fullAccess"
        :useIcons="true"
        mode="popup"
      >
        <DxPopup
          :show-title="true"
          width="70vw"
          height="auto"
          :dragEnabled="false"
          :title="$t('labels.fileCabinet')"
        />
        <DxForm>
          <DxItem :col-count="2" :col-span="2" item-type="group">
            <DxItem data-field="name" />
            <DxItem data-field="fullAddress" />
            <DxItem data-field="parentId" />
            <DxItem data-field="caseId" />
            <DxItem data-field="status" />
          </DxItem>
        </DxForm>
      </DxEditing>

      <DxColumn
        data-field="name"
        data-type="string"
        :caption="$t('labels.name')"
      >
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="fullAddress"
        data-type="string"
        :caption="$t('labels.fullAddress')"
      />
      <DxColumn
        data-field="parentId"
        data-type="number"
        :caption="$t('labels.fileCabinet')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="parentDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="caseId"
        data-type="array"
        :allow-sorting="false"
        :caption="$t('labels.case')"
      >
        <DxLookup
          value-expr="id"
          display-expr="caseNumber"
          :data-source="caseDataSource"
        />
        <DxFormItem :editor-options="caseOptions" editor-type="dxTagBox" />
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
        <DxRequiredRule />
      </DxColumn>
    </DxTreeList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxEditing,
  DxScrolling,
  DxRequiredRule,
  DxPaging,
  DxStateStoring,
  DxFilterRow,
  DxPopup,
  DxFormItem,
  DxColumnFixing,
  DxForm,
  DxItem,
  DxLookup
} from "devextreme-vue/tree-list";
import DxTagBox from "devextreme-vue/tag-box";
import DataSource from "devextreme/data/data_source";

import { TagBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/TagBox/TagBoxPropertiesWithDataSource";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

import { Statuses } from "~/infrastructure/data-sources/Statuses";

import { ArchiveStatus } from "~/infrastructure/enums/ArchiveStatus";
import { Status } from "~/infrastructure/enums/Status";

export default Vue.extend({
  components: {
    DxSearchPanel,
    DxColumn,
    DxTreeList,
    DxSelection,
    DxEditing,
    DxScrolling,
    DxRequiredRule,
    DxStateStoring,
    DxFilterRow,
    DxFormItem,
    DxLookup,
    DxPopup,
    DxPaging,
    DxHeaderFilter,
    DxColumnChooser,
    DxColumnFixing,
    DxForm,
    DxItem,
    DxTagBox
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
          loadUrl: `${this.$dataApi.fileCabinet}/archive/${this.archiveId}`,
          updateUrl: this.$dataApi.fileCabinet,
          removeUrl: this.$dataApi.fileCabinet,
          insertUrl: this.$dataApi.fileCabinet
        })
      }),
      parentDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.fileCabinet
      }),
      caseDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.case
      })
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["Archive"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"]["Archive"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"]["Archive"];
      return PermissionControler.fullAccess(permission);
    },
    statusDataSource() {
      return Statuses(this);
    },
    caseOptions() {
      return new TagBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.case,
        filter: [
          ["archiveStatus", "=", ArchiveStatus.InArchive],
          "and",
          ["fileCabinetId", "=", null]
        ],
        valueExpr: "id",
        displayExpr: "caseNumber"
      });
    }
  },
  methods: {
    initNewRow(e): void {
      e.data.status = Status.Active;
      e.data.archiveId = this.archiveId;
      if (e.data.parentId === 0) {
        e.data.parentId = null;
      }
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
