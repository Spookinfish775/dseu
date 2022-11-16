<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <DataGrid :caseId="caseId" />
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import DataGrid from "~/components/case/case-book/data-grid.vue";
import PageHeader from "~/components/page/page-header.vue";

export default Vue.extend({
  components: {
    PageHeader,
    DataGrid
  },
  computed: {
    caseId() {
      return +this.$route.params.id;
    },
    block() {
      return this.$store.getters["menu/getBlockByName"]("case.caseBook");
    },
    pageTitle() {
      let title: string = this.$t(this.block.title);
      return title;
    },
    pageDescription() {
      let description: string = this.$t(this.block.description);
      return description;
    }
  }
});
</script>
