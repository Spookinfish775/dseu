<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <ApplicantCreate />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import ApplicantCreate from "~/components/agency/specialApplicant/create-special-applicant.vue";
export default Vue.extend({
  components: {
    PageHeader,
    ApplicantCreate,
  },
  computed: {
    block() {
      return this.$store.getters["menu/getBlockByName"](
        "agency.createSpecialApplicant"
      );
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