<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <PageGuideBlock :items="block.items" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PageHeader from "~/components/page/page-header.vue";
import PageGuideBlock from "~/components/page/guide/block.vue";

export default Vue.extend({
  components: {
    PageHeader,
    PageGuideBlock,
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("archive");
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
