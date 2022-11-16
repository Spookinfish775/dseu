<template>
  <div>
    <DxSelectBox
      ref="selectBox"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
      :data-source="dataSource"
      :value="value"
      :read-only="readOnly"
      :showClearButton="true"
      :search-enabled="true"
      :search-expr="displayExpr"
      :open-on-field-click="false"
      :buttons="buttons"
      @value-changed="valueChanged"
    />
    <BasePopup
      ref="basePopup"
      :width="'70%'"
      :height="'auto'"
      :show-title="true"
      :title="$t('labels.encumbranceLetter')"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <component
        v-if="isCard"
        :is="encumbranceLetter"
        :data="selectedValue"
        :readOnly="true"
      />
      <ViewDataGrid @valueSelected="valueSelected" v-else />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import DataSource from "devextreme/data/data_source";
import { DxSelectBox } from "devextreme-vue/select-box";

import BasePopup from "~/components/page/popup.vue";
import ViewDataGrid from "./view-data-grid.vue";

export default Vue.extend({
  components: {
    DxSelectBox,
    BasePopup,
    ViewDataGrid,
  },
  props: {
    value: {
      default: null,
    },
    valueExpr: {
      type: String,
      default: "id",
    },
    displayExpr: {
      type: String,
      default: "id",
    },
    readOnly: {
      type: Boolean,
      default: false,
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
        filter: this.filter,
      }),
      encumbranceLetter: null,
      selectedValue: null,
      isCard: false,
    };
  },
  computed: {
    buttons() {
      return [
        {
          location: "after",
          name: "clear",
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
            },
          },
        },
      ];
    },
  },
  methods: {
    async valueSelected(data) {
      this.$refs.basePopup.close();
      await this.dataSource.reload();
      this.$refs["selectBox"].instance.repaint();
      this.$emit("valueChanged", data);
    },
    valueChanged(e) {
      this.$emit("valueChanged", e.value);
    },
  },
});
</script>