<template>
  <div>
    <PageHeader
      :title="$t('migration.pageHeader.title')"
      :description="$t('migration.pageHeader.description')"
    />
    <DataGrid />
    <!-- <TabPanel /> -->
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxFilterRow,
  DxHeaderFilter,
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import PageHeader from "~/components/page/page-header.vue";
import DataGrid from "~/components/migration/data-grid.vue";
import TabPanel from "~/components/migration/tab-panel/index.vue";

export default {
  components: {
    DxDataGrid,
    DxScrolling,
    DxFilterRow,
    DxHeaderFilter,
    PageHeader,
    DataGrid,
    TabPanel,
  },
  data() {
    return {
      dataMigration: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.dataMigration.index,
        }),
      }),
      dataTest: null,
    };
  },
};
</script>

<style lang="scss">
</style>
