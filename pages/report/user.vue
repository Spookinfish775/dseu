<template>
  <div>
    <PageHeader
      :title="pageTitle"
      :description="pageDescription"
      :showBackBtn="true"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PageHeader from "~/components/page/page-header.vue";

export default Vue.extend({
  components: {
    PageHeader,
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("report.user");
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