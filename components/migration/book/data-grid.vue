<template>
  <div>
    <DxDataGrid
      height="70vh"
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
        indicatorSrc: require('~/static/icons/loading.gif')
      }"
      @row-dbl-click="rowDblClick"
      @toolbar-preparing="toolbarPreparing"
    >
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxGrouping :auto-expand-all="true" />
      <!-- <DxColumnChooser :enabled="true" /> -->
      <DxColumnFixing :enabled="true" />
      <DxSearchPanel position="after" :visible="true" />
      <DxScrolling mode="virtual" />
      <DxPaging :enabled="true" :page-size="10" />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="migration"
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
        :caption="$t('migration.dataGrid.name')"
        width="400px"
      />
      <DxColumn
        data-field="uploadedDate"
        data-type="datetime"
        :caption="$t('migration.dataGrid.uploadedDate')"
        width="400px"
      />
      <DxColumn
        data-field="uploaderId"
        data-type="string"
        :caption="$t('migration.dataGrid.uploaderId')"
        width="400px">
        <DxLookup
          value-expr="id"
          display-expr="fullName"
          :data-source="uploadedApplicantDataSource"
        />
      </DxColumn>>
    </DxDataGrid>
    <BasePopup
      ref="basePopup"
      :width="'80%'"
      :height="'70vh'"
      :show-title="true"
      title="test title"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <TabPanel :rowData="rowData" @successedSaved="reloadData" />
    </BasePopup>
    <BasePopup
      ref="realEstateGroup"
      width="80%"
      height="70vh"
      :show-title="true"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <RealEstate :rowType="RowType.group" :data="rowData" />
    </BasePopup>
    <BasePopup
      ref="fileUpload"
      width="80%"
      height="70vh"
      :show-title="true"
      :drag-enabled="false"
    >
      <UploadForm />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DxButton from "devextreme-vue/button";

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
  DxPaging
} from "devextreme-vue/data-grid";
import BasePopup from "~/components/page/popup.vue";
import DataSource from "devextreme/data/data_source";

import { RowType } from "~/infrastructure/enums/RowType";

import TabPanel from "~/components/migration/tab-panel/index.vue";
import RealEstate from "~/components/migration/tab-panel/real-estate/index.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxButton,
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
    BasePopup,
    TabPanel,
    RealEstate
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.dataMigration.uploadedFiles
        })
      }),
      uploadedApplicantDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.user
      }),
      rowData: null,
      RowType
    };
  },
  methods: {
    reloadData() {
      this.dataSource.reload();
    },
    async rowDblClick(rowData) {
      this.rowData = rowData.data;
      if (rowData.rowType === RowType.group) {
        this.$refs["realEstateGroup"].open();
      }
      if (rowData.rowType === RowType.data) {
        this.$refs["basePopup"].open();
      }
    },
  }
});
</script>
