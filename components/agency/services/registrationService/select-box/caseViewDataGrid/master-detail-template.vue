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
      @row-dbl-click="e => selectValue(e.data)"
    >
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="caseBook"
      />
      <DxScrolling mode="virtual" />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        :useIcons="true"
        mode="row"
      />
      <DxColumn
        data-field="registrationServiceNumber"
        data-type="string"
        :caption="$t('labels.registrationServiceNumber')"
      />
      <DxColumn
        data-field="registrationStatementNumber"
        data-type="string"
        :caption="$t('labels.registrationStatementNumber')"
      />

      <DxColumn :width="150" :buttons="editButtons" type="buttons" />
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxLookup,
  DxRequiredRule,
  DxMasterDetail,
  DxStateStoring
} from "devextreme-vue/data-grid";
import DxSelectBox from "devextreme-vue/select-box";
import { DxScrollView } from "devextreme-vue/scroll-view";

import RegistrationServiceCard from "~/components/agency/services/registrationService/registrationService-card.vue";
import TypeSelector from "~/components/layout/type-selector/index.vue";

export default Vue.extend({
  components: {
    DxScrollView,
    DxMasterDetail,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling,
    DxLookup,
    DxRequiredRule,
    DxStateStoring,
    DxSelectBox,

    RegistrationServiceCard,
    TypeSelector
  },
  props: {
    case: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataSource: []
    };
  },
  computed: {
    editButtons() {
      return [
        {
          icon: "check",
          onClick: e => {
            this.selectValue(e.row.data);
          }
        }
      ];
    }
  },
  methods: {
    selectValue(value) {
      this.$emit("valueSelected", value);
    },
    async uploadData() {
      try {
        let { data } = await this.$axios.get(
          `${this.$dataApi.caseBook}/case/${this.case.id}`
        );
        this.dataSource = data.data;
      } catch (error) {
        throw error;
      }
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
            this.uploadData();
          }
        },
        ...e.toolbarOptions.items
      ];
    }
  },
  created() {
    this.uploadData();
  }
});
</script>
