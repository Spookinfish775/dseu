<template>
  <div>
    <PageHeader :showBackBtn="true" :title="pageTitle" />
    <RegistrationServiceCard
      :data="currentData"
      :currentStatement="currentStatement"
      @successedDeleted="successedDeleted"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RegistrationServiceCard from "~/components/agency/services/registrationService/registrationService-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
  // middleware: ["administration/users/index"],
  components: {
    PageHeader,
    RegistrationServiceCard
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"](
        "agency.registrationService"
      );
    },
    pageTitle(): string {
      let title: string = `${this.$t(
        "navigation.agency.cardRegistrationServiceTitle"
      )} №${this.currentData.registrationServiceNumber}`;
      return title;
    }
  },
  async asyncData({ $axios, params }) {
    const { data: currentData } = await $axios.get(
      `${dataApi.services.registrationService}/${+params.id}`
    );
    const { data: currentStatement } = await $axios.get(
      `${
        dataApi.statements.registrationStatement
      }/${+currentData.registrationStatementId}`
    );
    return {
      currentData,
      currentStatement
    };
  },
  methods: {
    successedDeleted() {
      this.$router.go(-1);
    }
  }
});
</script>
