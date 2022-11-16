<template>
  <div>
    <DxDataGrid
      height="80vh"
      :data-source="realEstate"
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
        data-field="address"
        data-type="string"
        :caption="$t('labels.address')"
        cell-template="grid-cell"
      />

      <template #grid-cell="{ data }">
          <div :class="EncumbranceProcessType[data.data.encumbranceProcessType]">{{ data.data.address }}</div>
      </template>


      <DxColumn
        data-field="caseRealEstateType"
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
        data-field="realEstateMissionId"
        data-type="number"
        :caption="$t('labels.realEstateMission')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="realEstateMissionDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="territorialUnitId"
        data-type="number"
        :caption="$t('labels.territorialUnit')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="territorialUnitDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="encumbranceProcessType"
        data-type="number"
        :caption="$t('labels.encumbranceProcessType')"
        cell-template="encumbranceProcessType-template"
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

      <template #encumbranceProcessType-template="{ data }">
        <div :class="EncumbranceProcessType[data.data.encumbranceProcessType]">
          <DxSelectBox
            :height="20"
            stylingMode="filled"
            :read-only="true"
            :value="data.data.encumbranceProcessType"
            value-expr="id"
            display-expr="name"
            :data-source="encumbranceProcessTypeDataSource"
          />
        </div>
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
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";
import DxSelectBox from "devextreme-vue/select-box";

import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
import { EncumbranceProcessType } from "~/infrastructure/enums/EncumbranceProcessType";
import { EncumbranceProcessTypes } from "~/infrastructure/data-sources/EncumbranceProcessTypes";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { Statuses } from "~/infrastructure/data-sources/Statuses";

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
    DxSelectBox,
  },
  data() {
    return {
      realEstate: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.realEstate,
        }),
      }),
      currencyDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.currency,
      }),
      territorialUnitDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.territorialUnit,
      }),
      realEstateTypeDataSource: RealEstateTypes(this),
      encumbranceProcessTypeDataSource: EncumbranceProcessTypes(this),
      realEstateMissionDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.realEstateMission,
      }),
      editButtons: [
        {
          hint: this.$t("labels.detail"),
          icon: "info",
          onClick: (e) => {
            this.$router.push(`/realEstate/${e.row.data.id}`);
          },
        },
      ],
      EncumbranceProcessType,
      statusDataSource: Statuses(this),
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["RealEstate"];
      return PermissionControler.canCreate(permission);
    },
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["RealEstate"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["RealEstate"];
			return PermissionControler.fullAccess(permission);
		},
  },
  methods: {
    rowDblClick(e) {
      this.$router.push(`/realEstate/${e.data.id}`);
    },
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "plus",
            visible: this.canCreate,
          },
          onClick: () => {
            this.$router.push(`/realEstate/create`);
          },
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh",
          },
          onClick: () => {
            this.realEstate.reload();
          },
        },
        ...e.toolbarOptions.items,
      ];
    },
  },
});
</script>

<style lang="scss">
.EncumbranceLetter {
  background-color: yellow;
}
.Forced {
  background-color: red;
  color: white !important;
  input {
    color: white !important;
  }
}
.Voluntary {
  background-color: pink;
}
</style>
