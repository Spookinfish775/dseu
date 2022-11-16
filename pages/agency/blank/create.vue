<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <CreateBlanks class="createBlank" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import CreateBlanks from "~/components/agency/blank/create.vue";

export default Vue.extend({
  components: {
    PageHeader,
    CreateBlanks
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("agency.createBlanks");
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

<style lang="scss" scoped>
.createBlank {
  max-width: 800px;
  height: 85vh;
  box-shadow: -3px -7px 9px 5px rgba(0, 0, 0, 0.27);
  -webkit-box-shadow: -3px -7px 9px 5px rgba(0, 0, 0, 0.27);
  -moz-box-shadow: -3px -7px 9px 5px rgba(0, 0, 0, 0.27);
  padding: 8px;
  border-radius: 8px;
  border: 1px solid $base-border-color;
  margin: auto;
}
</style>
