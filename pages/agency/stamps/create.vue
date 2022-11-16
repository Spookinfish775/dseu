<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <StampCreate />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import StampCreate from "~/components/agency/stamps/create.vue";
export default Vue.extend({
  components: {
    PageHeader,
    StampCreate,
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("agency.createStamp");
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