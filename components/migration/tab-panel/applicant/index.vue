<template>
  <div>
    <ApplicantCreate
      v-if="applicant && !isCard"
      :applicantData="applicant"
      :uploadedStateRegisterId="data.id"
      @successedSaved="applicantSaved"
    />
    <ApplicantCard v-if="applicant && isCard" :data="applicant" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ApplicantCard from "~/components/migration/tab-panel/applicant/applicant-card.vue";
import ApplicantCreate from "~/components/migration/tab-panel/applicant/applicant-create.vue";

export default Vue.extend({
  components: {
    ApplicantCard,
    ApplicantCreate
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      applicant: null,
      isCard: false
    };
  },
  methods: {
    async loadApplicant(id) {
      const { data } = await this.$axios.get(
        `${this.$dataApi.dataMigration.applicant}/${id}`
      );
      for (const key in data) {
        if (data[key] === "-") data[key] = "";
      }

      this.isCard = false;
      this.applicant = data;
    },
    async loadActualApplicant(id) {
      const { data } = await this.$axios.get(
        `${this.$dataApi.applicant}/${id}`
      );
      this.isCard = true;
      this.applicant = data;
    },
    applicantSaved(data) {
      this.loadActualApplicant(data.id);
      this.$emit("successedSaved");
    }
  },
  created() {
    if (this.data) {
      if (this.data.actualApplicantId) {
        this.loadActualApplicant(this.data.actualApplicantId);
      } else {
        this.loadApplicant(this.data.uploadedApplicantId);
      }
    }
  }
});
</script>
