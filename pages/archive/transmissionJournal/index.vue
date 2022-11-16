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
import DataGrid from "~/components/archive/transmission-journal/index.vue";
export default Vue.extend({
  components: {
    PageHeader,
    DataGrid
  },
  computed: {
    pageTitle(): string {
      return this.$t("navigation.agency.transmissionJournalTitle");
    },
    pageDescription(): string {
      return this.$t("navigation.agency.transmissionJournalDescription");
    }
  }
});
</script>
