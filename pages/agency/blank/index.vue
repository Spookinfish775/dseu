<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <BlankGridData />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import BlankGridData from "~/components/agency/blank/grid.vue";
export default Vue.extend({
  components: {
    PageHeader,
    BlankGridData
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("agency.blank");
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

<style scoped></style>
