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
      <DxColumnChooser :enabled="true" />
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
        data-field="elektronTb"
        data-type="string"
        :caption="$t('migration.dataGrid.elektronTb')"
        width="100px"
      />
      <DxColumn
        data-field="tb"
        data-type="string"
        :caption="$t('migration.dataGrid.tb')"
        width="100px"
      />
      <DxColumn
        data-field="branchNumber"
        data-type="string"
        :caption="$t('migration.dataGrid.branchNumber')"
        width="100px"
      />
      <DxColumn
        data-field="registrationStatementIndex"
        data-type="string"
        :caption="$t('migration.dataGrid.registrationStatementIndex')"
        width="100px"
      />
      <DxColumn
        data-field="dateTime"
        data-type="string"
        :caption="$t('migration.dataGrid.dateTime')"
        width="100px"
      />
      <DxColumn
        data-field="registrationServiceIndex"
        data-type="string"
        :caption="$t('migration.dataGrid.registrationServiceIndex')"
        width="100px"
      />
      <DxColumn
        data-field="executionTime"
        data-type="string"
        :caption="$t('migration.dataGrid.executionTime')"
        width="100px"
      />
      <DxColumn
        data-field="uploadedApplicantId"
        data-type="number"
        :caption="$t('migration.dataGrid.uploadedApplicant.title')"
      >
        <DxLookup
          value-expr="id"
          display-expr="fullName"
          :data-source="uploadedApplicantDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="address"
        data-type="string"
        :caption="$t('migration.dataGrid.uploadedRealEstate.address')"
        width="180px"
      />
      <DxColumn
        data-field="lawName"
        data-type="string"
        :caption="$t('migration.dataGrid.lawName')"
        width="180px"
      />
      <DxColumn
        data-field="partOfRight"
        data-type="string"
        :caption="$t('migration.dataGrid.partOfRight')"
        width="100px"
      />
      <DxColumn
        data-field="registrationServiceNumber"
        data-type="string"
        :caption="$t('migration.dataGrid.registrationServiceNumber')"
        width="100px"
      />
      <DxColumn
        data-field="user"
        data-type="string"
        :caption="$t('migration.dataGrid.user')"
      />
      <DxColumn
        data-field="blankNumber"
        data-type="string"
        :caption="$t('migration.dataGrid.blankNumber')"
        width="100px"
      />
      <DxColumn
        data-field="receiptSum"
        data-type="string"
        :caption="$t('migration.dataGrid.receiptSum')"
        width="100px"
      />
      <DxColumn
        data-field="receiptNumber"
        data-type="string"
        :caption="$t('migration.dataGrid.receiptNumber')"
        width="100px"
      />
      <DxColumn
        data-field="technicalReceiptSum"
        data-type="string"
        :caption="$t('migration.dataGrid.technicalReceiptSum')"
        width="100px"
      />
      <DxColumn
        data-field="technicalReceiptNumber"
        data-type="string"
        :caption="$t('migration.dataGrid.technicalReceiptNumber')"
        width="100px"
      />
      <DxColumn
        data-field="officialDocumentsFullInformation"
        data-type="string"
        :caption="$t('migration.dataGrid.officialDocumentsFullInformation')"
        width="600px"
      />
      <DxColumn
        data-field="note"
        data-type="string"
        :caption="$t('migration.dataGrid.note')"
        width="100px"
      />
    </DxDataGrid>
    <BasePopup
      ref="basePopup"
      :width="'100%'"
      :height="'100vh'"
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
import UploadForm from "./upload-form.vue";
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
    RealEstate,
    UploadForm
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.dataMigration.index
        })
      }),
      uploadedApplicantDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.dataMigration.applicant
      }),
      uploadedRealEstateDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.dataMigration.realEstate
      }),
      rowData: null,
      RowType
    };
  },
  methods: {
      foo(e) {
       this.$router.push(`/migration/book/id`);
    },
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
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            text:'Gelen fayllar'
          },
          onClick: () => {
            this.foo()
          }
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "plus"
          },
          onClick: () => {
            this.$refs["fileUpload"].open();
          }
        },
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
