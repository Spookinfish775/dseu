<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <DataGrid :archiveId="+$route.params.id" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PageHeader from "~/components/page/page-header.vue";
import DataGrid from "~/components/archive/archive-list-of-case.vue";
import { dataApi } from "~/static/dataApi";
export default Vue.extend({
  components: {
    PageHeader,
    DataGrid
  },
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`${dataApi.archive}/${+params.id}`);
    return { archive: data };
  },

  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("archive");
    },
    pageTitle() {
      let title: string = `${this.archive.name} ${this.$t(this.block.title)}`;
      return title;
    },
    pageDescription() {
      let description: string = this.$t(this.block.description);
      return description;
    }
  }
});
</script>
