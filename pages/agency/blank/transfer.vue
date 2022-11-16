<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <BlankTransfer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import BlankTransfer from "~/components/agency/blank/transfer.vue";
export default Vue.extend({
  components: {
    PageHeader,
    BlankTransfer
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("agency.blankTransfer");
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
