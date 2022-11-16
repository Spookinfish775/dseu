<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <DataGrid />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PageHeader from "~/components/page/page-header.vue";
import DataGrid from "~/components/administration/specialApplicantType/data-grid.vue";

export default Vue.extend({
  middleware: ["administration/users/index"],
  components: {
    PageHeader,
    DataGrid,
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"](
        "administration.specialApplicantType"
      );
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

<style scoped></style>
