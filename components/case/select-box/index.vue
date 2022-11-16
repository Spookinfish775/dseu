<template>
  <div>
    <DxSelectBox
      ref="selectBox"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
      :data-source="dataSource"
      :value="value"
      :buttons="buttons"
      :read-only="readOnly"
      :showClearButton="true"
      :search-enabled="true"
      :search-expr="displayExpr"
      :open-on-field-click="false"
      @value-changed="valueChanged"
    />
    <BasePopup
      ref="basePopup"
      width="70%"
      height="80vh"
      :show-title="true"
      :title="$t('navigation.caseBlock.title')"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <ViewDataGreed
        :withCaseBook="withCaseBook"
        :valueExpr="valueExpr"
        :filter="filter"
				:caseBookFilter="caseBookFilter"
        @valueSelected="valueSelected"
        @caseBookSelected="caseBookSelected"
      />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import ViewDataGreed from "./view-data-greed.vue";
import BasePopup from "~/components/page/popup.vue";

export default Vue.extend({
  components: {
    DxSelectBox,
    ViewDataGreed,
    BasePopup
  },
  props: {
    value: {
      default: null
    },
    valueExpr: {
      type: String,
      default: "id"
    },
    displayExpr: {
      type: String,
      default: "caseNumber"
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Array,
      default: null
    },
    withCaseBook: {
      type: Boolean,
      default: false
    },
    caseBookFilter: {
      type: Array,
      default: null
    }
  },
  computed: {
    dataSource() {
      return new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.withCaseBook
            ? this.$dataApi.caseBook
            : this.$dataApi.case
        }),
        filter: this.filter
      });
    },
    buttons() {
      return [
        {
          location: "after",
          name: "clear"
        },
        {
          location: "after",
          name: "list",
          options: {
            icon: "bulletlist",
            stylingMode: "text",
            visible: !this.readOnly,
            onClick: () => {
              this.$refs.basePopup.open();
            }
          }
        }
      ];
    }
  },

  methods: {
    async valueSelected(data) {
      this.$refs.basePopup.close();
      await this.dataSource.reload();
      this.$refs["selectBox"].instance.repaint();
      this.$emit("valueChanged", data);
    },
    async caseBookSelected(data) {
      this.$refs.basePopup.close();
      await this.dataSource.reload();
      this.$refs["selectBox"].instance.repaint();
      this.$emit("caseBookSelected", data);
    },
    valueChanged(e) {
      this.$emit("valueChanged", e.value);
    }
  }
});
</script>
