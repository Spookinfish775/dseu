<template>
  <DxTabPanel :data-source="tabs" :selected-index="selectedIndex">
    <template #title="{ data: tab }">
      <span>{{ tab.title }}</span>
    </template>
    <template #item="{ data: tab }">
      <component
        class="tab-item"
        :is="tab.component"
        :data="rowData"
        @successedSaved="successedSaved"
      />
    </template>
  </DxTabPanel>
</template>

<script lang="ts">
import Vue from "vue";

import DxTabPanel, { DxItem } from "devextreme-vue/tab-panel";

import Applicant from "~/components/migration/tab-panel/applicant/index.vue";
import RealEstate from "~/components/migration/tab-panel/real-estate-old/index.vue";
import Statement from "./statement/index.vue";

export default Vue.extend({
  components: {
    DxTabPanel,
    DxItem,
    Applicant,
    RealEstate,
    Statement
  },
  props: {
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tabs: [
        {
          title: this.$t("labels.realEstate"),
          component: "RealEstate",
          disabled: false
        },
        {
          title: this.$t("labels.applicant"),
          component: "Applicant",
          disabled: false
        },
        
        {
          title: this.$t("labels.statement"),
          component: "Statement",
          disabled: false
        }
      ],
      selectedIndex: 0
    };
  },
  methods: {
    successedSaved() {
      this.$emit("successedSaved");
    },
    toRealEstate() {
      this.tabs[1].disabled = false;
      this.selectedIndex += 1;
    }
  }
});
</script>

<style lang="scss">
.tab-item {
  padding: 20px 10px;
}
</style>
