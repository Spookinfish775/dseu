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
      :hover-state-enabled="true"
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
        :file-name="$t('navigation.reports.reportBlank.title')"
      />
      <DxSelection
        select-all-mode="page"
        show-check-boxes-mode="onClick"
        mode="multiple"
      />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="blankReport"
      />
      <DxColumn
        data-field="organizationName"
        data-type="string"
        :caption="$t('navigation.reports.reportBlank.organizationName')"
      />
      <DxColumn
        data-field="emptyCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBlank.emptyCount')"
      />
      <DxColumn
        data-field="damagedCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBlank.damagedCount')"
      />
      <DxColumn
        data-field="defectedCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBlank.defectedCount')"
      />
      <DxColumn
        data-field="givenCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBlank.givenCount')"
      />
      <DxColumn
        data-field="exchangeCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBlank.exchangeCount')"
      />
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxDataGrid,
  DxSearchPanel,
  DxColumn,
  DxLabel,
  DxEditing,
  DxScrolling,
  DxStateStoring,
  DxRequiredRule,
  DxFilterRow,
  DxPaging,
  DxSelection,
  DxLookup,
  DxHeaderFilter,
  DxGrouping,
  DxGroupPanel,
  DxExport,
  DxColumnChooser,
  DxColumnFixing,
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
export default Vue.extend({
  components: {
    DxDataGrid,
    DxSearchPanel,
    DxColumn,
    DxLabel,
    DxEditing,
    DxScrolling,
    DxStateStoring,
    DxRequiredRule,
    DxSelection,
    DxFilterRow,
    DxPaging,
    DxLookup,
    DxHeaderFilter,
    DxGrouping,
    DxGroupPanel,
    DxExport,
    DxColumnChooser,
    DxColumnFixing,
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "defectedCount",
          loadUrl: this.$dataApi.reportByBlank,
        }),
      }),
      statusDataSource: Statuses(this),
    };
  },
  methods: {
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