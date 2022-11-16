<template>
  <div>
    <DxTreeList
      height="80vh"
      parent-id-expr="parentId"
      :data-source="territorialUnit"
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
      :remoteOperations="{
        filtering: true,
        sorting: true,
        grouping: true,
      }"
      @row-dbl-click="rowDblClick"
      @toolbar-preparing="toolbarPreparing"
    >
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxColumnChooser :enabled="true" />
      <DxColumnFixing :enabled="true" />
      <DxSearchPanel position="after" :visible="true" />
      <DxScrolling mode="virtual" />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="territorialUnit"
      />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        :useIcons="true"
        mode="row"
      />

      <DxColumn
        data-field="name"
        data-type="string"
        :caption="$t('labels.name')"
      />
      <DxColumn
        data-field="typeName"
        data-type="string"
        :caption="$t('labels.typeName')"
      />
      <DxColumn
        data-field="regionId"
        data-type="number"
        :caption="$t('labels.region')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="regionDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="districtId"
        data-type="number"
        :caption="$t('labels.district')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="districtDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="parentId"
        data-type="number"
        :caption="$t('labels.parent')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="parentDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="fullAddress"
        data-type="string"
        :caption="$t('labels.fullAddress')"
      />
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

      <template #quickFilter>
        <QuickFilter @valueChanged="setStore" />
      </template>
    </DxTreeList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxTreeList,
  DxColumn,
  DxFilterRow,
  DxEditing,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxScrolling,
  DxStateStoring,
  DxColumnFixing,
} from "devextreme-vue/tree-list";
import DataSource from "devextreme/data/data_source";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
//components
import QuickFilter from "../components/quick-filter.vue";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxSearchPanel,
    DxTreeList,
    DxColumn,
    DxEditing,
    DxHeaderFilter,
    DxScrolling,
    DxLookup,
    DxColumnChooser,
    DxColumnFixing,
    DxFilterRow,
    DxStateStoring,
    DxSelection,
    QuickFilter,
  },
  props: {
    valueExpr: {
      type: String,
      default: "id",
    },
  },
  data() {
    return {
      filter: null,
      territorialUnit: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.territorialUnit,
        }),
      }),
      parentDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.territorialUnit,
      }),
      regionDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.region,
      }),
      districtDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.district,
      }),
      statusDataSource: Statuses(this),
    };
  },
  computed: {
    editButtons() {
      return [
        {
          hint: this.$t("labels.choose"),
          icon: "check",
          onClick: (e) => {
            this.$emit("valueSelected", e.row.data[this.valueExpr]);
          },
        },
      ];
    },
    canCreate() {
      let permission: number =
        this.$store.getters["user/claims"]["ManipulateTerritorialUnit"];
      return PermissionControler.canCreate(permission);
    },
  },
  methods: {
    setStore(filter) {
      this.territorialUnit = new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.territorialUnit,
        }),
        filter,
      });
    },
    rowDblClick(e) {
      this.$emit("valueSelected", e.data[this.valueExpr]);
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
            this.territorialUnit.reload();
          },
        },
        ...e.toolbarOptions.items,
        {
          template: "quickFilter",
          location: "after",
        },
      ];
    },
  },
});
</script>

<style scoped></style>
