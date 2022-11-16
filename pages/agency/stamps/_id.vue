<template>
  <div>
    <PageHeader :showBackBtn="true" :title="pageTitle" />
    <StampCard :data="currentValue" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PageHeader from "~/components/page/page-header.vue";
import StampCard from "~/components/agency/stamps/card.vue";

import { dataApi } from "~/static/dataApi";

export default Vue.extend({
  components: {
    PageHeader,
    StampCard,
  },
  data() {
    return {
      currentValue: null,
    };
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"]("agency.stamps");
    },
    pageTitle(): string {
      let title: string = `${this.$t(this.block.title)}: ${
        this.currentValue.number
      }`;
      return title;
    },
  },
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`${dataApi.stamp}/${+params.id}`);
    return {
      currentValue: data,
    };
  },
});
</script>

<style scoped>
</style>