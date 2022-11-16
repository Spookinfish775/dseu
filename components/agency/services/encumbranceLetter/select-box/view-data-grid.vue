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
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="encumbranceLetter"
      />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        :useIcons="true"
        mode="row"
      />
      <DxColumn
        data-field="encumbranceId"
        data-type="number"
        :caption="$t('labels.encumbrance')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="encumbranceDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="realEstateId"
        data-type="number"
        :caption="$t('labels.realEstate')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="realEstateDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="realEstateAddress"
        data-type="string"
        :caption="$t('labels.realEstateAddress')"
      />
      <DxColumn
        data-field="enteredDate"
        data-type="date"
        :caption="$t('labels.enteredDate')"
      />
      <DxColumn
        data-field="isReleased"
        data-type="boolean"
        :caption="$t('labels.isReleased')"
      />
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
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

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
  props: {
    valueExpr: {
      type: String,
      default: "id",
    },
    filter: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.encumbranceLetter,
        }),
      }),
      encumbranceDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.law,
      }),
      realEstateDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.realEstate,
      }),
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
  },
  methods: {
    rowDblClick(e) {
      this.$emit("valueSelected", e.data.id);
    },
  },
});
</script>