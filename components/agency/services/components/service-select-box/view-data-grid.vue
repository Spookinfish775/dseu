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
        indicatorSrc: require('~/static/icons/loading.gif'),
      }"
      @row-dbl-click="rowDblClick"
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
        :file-name="$t('navigation.agency.statementsTitle')"
      />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="services"
      />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        :useIcons="true"
        mode="row"
      />
      <DxColumn
        data-field="serviceType"
        data-type="number"
        :caption="$t('labels.serviceType')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="serviceTypeDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="executionTime"
        data-type="datetime"
        :caption="$t('labels.executionTime')"
      />
      <DxColumn
        data-field="organizationId"
        data-type="number"
        :caption="$t('labels.organization')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="organizationDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="userId"
        data-type="string"
        :caption="$t('labels.executor')"
      >
        <DxLookup
          value-expr="id"
          display-expr="fullName"
          :data-source="userDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="note"
        data-type="string"
        :caption="$t('labels.note')"
      />
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
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import { ServiceTypes } from "~/infrastructure/data-sources/ServiceTypes";

export default Vue.extend({
  components: {
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
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.services.service,
        }),
      }),
      organizationDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.organization,
      }),
      userDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.user,
      }),
      serviceTypeDataSource: ServiceTypes(this),
    };
  },
  computed: {},
  methods: {
    rowDblClick(e) {
      this.$emit("valueSelected", e.data.id);
    },
  },
});
</script>