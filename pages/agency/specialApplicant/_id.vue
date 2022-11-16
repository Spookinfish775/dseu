<template>
  <div>
    <PageHeader :showBackBtn="true" :title="pageTitle" />
    <SpecialApplicantCard :data="currentValue" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PageHeader from "~/components/page/page-header.vue";
import SpecialApplicantCard from "~/components/agency/specialApplicant/card-special-applicant.vue";

import { dataApi } from "~/static/dataApi";

export default Vue.extend({
  components: {
    PageHeader,
    SpecialApplicantCard,
  },
  data() {
    return {
      currentValue: null,
    };
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"](
        "agency.specialApplicant"
      );
    },
    pageTitle(): string {
      let title: string = `${this.$t(this.block.title)}: ${
        this.currentValue.identityDocumentName
      }`;
      return title;
    },
  },
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(
      `${dataApi.specialApplicant}/${+params.id}`
    );
    return {
      currentValue: data,
    };
  },
});
</script>