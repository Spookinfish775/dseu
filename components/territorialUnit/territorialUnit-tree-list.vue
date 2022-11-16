<template>
  <DxTreeList
    height="80vh"
    parent-id-expr="parentId"
    :data-source="territorialUnit"
    :show-borders="true"
    :hoverStateEnabled="true"
    :errorRowEnabled="false"
    :remote-operations="true"
    :allow-column-reordering="false"
    :allow-column-resizing="true"
    :column-auto-width="true"
    :load-panel="{
      enabled: true,
      indicatorSrc: require('~/static/icons/loading.gif')
    }"
    :remoteOperations="{
      filtering: true,
      sorting: true,
      grouping: true
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
      :visible="false"
      data-field="name"
      data-type="string"
      :caption="$t('labels.name')"
    />
    <DxColumn
      :visible="false"
      data-field="typeName"
      data-type="string"
      :caption="$t('labels.typeName')"
    />
    <DxColumn
      :visible="false"
      data-field="regionId"
      data-type="number"
      :allow-filtering="false"
      :caption="$t('labels.region')"
    >
      <DxLookup
        value-expr="id"
        display-expr="name"
        :data-source="regionDataSource"
      />
    </DxColumn>
    <DxColumn
      :visible="false"
      data-field="districtId"
      data-type="number"
      :allow-filtering="false"
      :caption="$t('labels.district')"
    >
      <DxLookup
        value-expr="id"
        display-expr="name"
        :data-source="districtDataSource"
      />
    </DxColumn>
    <DxColumn
      :visible="false"
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
  DxColumnFixing
} from "devextreme-vue/tree-list";
import DataSource from "devextreme/data/data_source";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
//components
import QuickFilter from "./components/quick-filter.vue";

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
    QuickFilter
  },
  data() {
    return {
      filter: null,
      territorialUnit: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.territorialUnit
        })
      }),
      parentDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.territorialUnit
      }),
      regionDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.region
      }),
      districtDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.district
      }),
      statusDataSource: Statuses(this)
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "TerritorialUnit"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "TerritorialUnit"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "TerritorialUnit"
      ];
      return PermissionControler.fullAccess(permission);
    },
    editButtons() {
      return [
        {
          hint: this.$t("territorialUnit.createUnitIn"),
          icon: "plus",
          visible: this.canCreate,
          onClick: e => {
            const { districtId, id: parentId, regionId } = e.row.data;

            this.$router.push({
              path: `/territorialUnit/create`,
              query: { districtId, parentId, regionId }
            });
          }
        },
        {
          hint: this.$t("labels.detail"),
          icon: "info",
          onClick: e => {
            this.$router.push(`/territorialUnit/${e.row.data.id}`);
          }
        }
      ];
    }
  },
  methods: {
    setStore(filter) {
      this.territorialUnit = new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.territorialUnit
        }),
        filter
      });
    },
    rowDblClick(e) {
      this.$router.push(`/territorialUnit/${e.data.id}`);
    },
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "plus",
            visible: this.canCreate
          },
          onClick: () => {
            this.$router.push(`/territorialUnit/create`);
          }
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh"
          },
          onClick: () => {
            this.territorialUnit.reload();
          }
        },
        ...e.toolbarOptions.items,
        {
          template: "quickFilter",
          location: "after"
        }
      ];
    }
  }
});
</script>

<style scoped></style>
