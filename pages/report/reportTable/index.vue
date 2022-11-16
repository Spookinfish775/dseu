<template>
  <div>
    <PageHeader
      :title="pageTitle"
      :description="pageDescription"
      :showBackBtn="true"
    />
    <Card />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PageHeader from "~/components/page/page-header.vue";
import Card from "~/components/report/report-table/card.vue";

export default Vue.extend({
  components: {
    PageHeader,
    Card,
  },
  data() {
    return {};
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("reportTable");
    },
    pageTitle() {
      let title: string = this.$t(this.block.title);
      return title;
    },
    pageDescription() {
      let description: string = this.$t(this.block.description);
      return description;
    },
  },
  methods: {},
});
</script>

<style lang="scss">
</style>