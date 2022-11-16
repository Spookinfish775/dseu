<template>
  <div>
    <DxDataGrid
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
        :file-name="$t('navigation.realEstate.title')"
      />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="realEstate"
      />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        :useIcons="true"
        mode="row"
      />

      <DxColumn
        data-field="caseNumber"
        data-type="string"
        :caption="$t('labels.caseNumber')"
      />
      <DxColumn
        data-field="branchId"
        data-type="number"
        :group-index="1"
        :caption="$t('labels.branch')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="branchDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="realEstateId"
        data-type="number"
        :caption="$t('labels.realEstate')"
      >
        <DxLookup
          value-expr="id"
          display-expr="address"
          :data-source="realEstateDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="realEstateType"
        data-type="number"
        :caption="$t('labels.realEstateType')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="realEstateTypeDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="openDate"
        data-type="date"
        :caption="$t('labels.openDate')"
      />
      <DxColumn
        data-field="closeDate"
        data-type="date"
        :caption="$t('labels.closeDate')"
      />

      <DxMasterDetail :enabled="withCaseBook" template="masterDetailTemplate" />
      <template #masterDetailTemplate="{ data }">
        <MasterDetailTemplate
          @valueSelected="caseBookSelected"
          :case="data.data"
        />
      </template>

      <DxColumn :width="70" :buttons="editButtons" type="buttons" />
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
  DxMasterDetail
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import MasterDetailTemplate from "~/components/case/select-box/master-detail-template.vue";

import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

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
    DxMasterDetail,
    MasterDetailTemplate
  },
  props: {
    withCaseBook: {
      type: Boolean,
      default: false
    },
    valueExpr: {
      type: String,
      default: "id"
    },
    filter: {
      type: Array,
      default: null
    },
    caseBookFilter: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.case
        }),
        filter: this.withCaseBook ? this.caseBookFilter : this.filter
      }),
      branchDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.organization
      }),
      realEstateDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.realEstate
      }),
      realEstateTypeDataSource: RealEstateTypes(this)
    };
  },
  computed: {
    editButtons() {
      return [
        {
          hint: this.$t("labels.choose"),
          icon: "check",
          visible: !this.withCaseBook,
          onClick: e => {
            this.$emit("valueSelected", e.row.data[this.valueExpr]);
          }
        }
      ];
    },
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "UserRegistration"
      ];
      return PermissionControler.canCreate(permission);
    }
  },
  methods: {
    caseBookSelected(data) {
      this.$emit("caseBookSelected", data);
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
