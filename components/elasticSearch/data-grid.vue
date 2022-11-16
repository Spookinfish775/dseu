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
        indicatorSrc: require('~/static/icons/loading.gif')
      }"
      @toolbar-preparing="toolbarPreparing"
      @row-dbl-click="rowDblClick"
    >
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxScrolling mode="virtual" />
      <DxPaging :enabled="true" :page-size="10" />
      <DxStateStoring :enabled="true" type="localStorage" storage-key="case" />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="true"
        :useIcons="true"
        mode="row"
      />

      <DxColumn
        :allow-sorting="false"
        data-field="source"
        cell-template="foundHeadTemplate"
        :width="250"
        :fixed="true"
        :caption="$t('labels.registrationService')"
      />

      <DxColumn
        :allow-sorting="false"
        data-field="highlight"
        cell-template="foundTemplate"
        :caption="$t('labels.found')"
      />

      <DxColumn :width="100" :buttons="editButtons" type="buttons" />

      <template #foundHeadTemplate="{ data }">
        <FoundItemHead :data="data.value" />
      </template>

      <template #foundTemplate="{ data }">
        <FoundItem :data="data.value" />
      </template>
    </DxDataGrid>

    <BasePopup
      ref="basePopup"
      width="70%"
      height="80vh"
      :show-title="true"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <RegistrationServiceCard
        :data="currentRow"
        :currentStatement="currentStatement"
      />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxSearchPanel,
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxRequiredRule,
  DxStateStoring,
  DxMasterDetail,
  DxFilterRow,
  DxLookup,
  DxPaging,
  DxHeaderFilter,
  DxGrouping,
  DxGroupPanel,
  DxExport,
  DxColumnChooser,
  DxColumnFixing
} from "devextreme-vue/data-grid";

import FoundItem from "./found-item.vue";
import FoundItemHead from "./found-item-head.vue";
import BasePopup from "~/components/page/popup.vue";
import RegistrationServiceCard from "~/components/agency/services/registrationService/registrationService-card.vue";

export default Vue.extend({
  components: {
    DxSearchPanel,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling,
    DxRequiredRule,
    DxStateStoring,
    DxMasterDetail,
    DxFilterRow,
    DxLookup,
    DxPaging,
    DxHeaderFilter,
    DxGrouping,
    DxGroupPanel,
    DxExport,
    DxColumnChooser,
    DxColumnFixing,
    FoundItem,
    FoundItemHead,
    BasePopup,
    RegistrationServiceCard
  },
  props: {
    selectable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataSource: [],
      currentRow: null,
      currentStatement: null
    };
  },
  computed: {
    editButtons() {
      return [
        {
          hint: this.$t("labels.select"),
          icon: "check",
          visible: this.selectable,
          onClick: e => {
            this.$emit("select", e.row.data.source);
          }
        },
        {
          hint: this.$t("labels.detail"),
          icon: "info",
          onClick: async e => {
            this.currentRow = e.row.data.source;
            await this.getCurrentStatement(e.row.data.source.id);
            this.$refs["basePopup"].open();
          }
        }
      ];
    }
  },
  methods: {
    async searchServices(value) {
      let { data } = await this.$axios.get("/api/Search", {
        params: {
          query: value
        }
      });
      if (data) {
        this.dataSource = data;
      } else {
        this.dataSource = [];
      }
    },
    rowDblClick(e) {
      if (this.selectable) {
        this.$emit("select", e.data.source);
      } else {
        this.$refs["basePopup"].open();
      }
    },
    async getCurrentStatement(registrationServiceId) {
      const { data: currentStatement } = await this.$axios.get(
        `${
          this.$dataApi.statements.registrationStatement
        }/service/${+registrationServiceId}`
      );
      this.currentStatement = currentStatement;
    },
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxTextBox",
          options: {
            width: 300,
            showClearButton: true,
            placeholder: this.$t("navigation.elasticSearch.title"),
            onValueChanged: e => {
              this.searchServices(e.value);
            }
          }
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh"
          },
          onClick: () => {
            this.dataSource = [];
          }
        },
        ...e.toolbarOptions.items
      ];
    }
  }
});
</script>
