<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
    />
    <BlankDestroyedGrid />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import BlankDestroyedGrid from "~/components/agency/blank/destroyed-act.vue";
export default Vue.extend({
  components: {
    PageHeader,
    BlankDestroyedGrid
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("agency.destroyedAct");
    },
    pageTitle() {
      let title: string = this.$t(this.block.title);
      return title;
    },
  }
});
</script>

<style scoped></style>