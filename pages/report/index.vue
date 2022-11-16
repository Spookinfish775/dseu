<template>
  <div>
    <PageHeader :title="pageTitle" :description="pageDescription" />
    <PageGuideList :items="block.items" />
    <!-- <ReportDataGrid /> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
// import ReportDataGrid from "~/components/report/report-data-grid.vue";
import PageGuideList from "~/components/page/guide/list.vue";
export default Vue.extend({
  middleware: ["history"],
  components: {
    PageHeader,
    // ReportDataGrid,
    PageGuideList,
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("report");
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
});
</script>