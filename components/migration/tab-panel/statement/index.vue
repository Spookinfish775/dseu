<template>
  <div>
    <StatementCard
      v-if="realEstate && !isCard"
      :data="realEstate"
      :uploadedStateRegisterId="realEstate.id"
      :uploadedStateRegisters="uploadedStateRegisters"
      @successedSaved="successedSaved"
    />
    <StatementCreate :data="data" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import StatementCard from "./card.vue";
import StatementCreate from "./create.vue";

export default Vue.extend({
  components: {
    StatementCard,
    StatementCreate
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      realEstate: null,
      isCard: false
    };
  },
  computed: {
    uploadedStateRegisters() {
      return [this.data.uploadedRealEstateId];
    }
  },
  methods: {
    async getRealEstate(id) {
      const { data } = await this.$axios.get(
        `${this.$dataApi.realEstate}/${id}`
      );
      this.realEstate = data;
      this.isCard = true;
    },
    async getRealEstateForGroup(id) {
      const { data } = await this.$axios.get(
        `${this.$dataApi.dataMigration.realEstate}/${id}`
      );
      for (const key in data) {
        if (data[key] === "-") data[key] = "";
      }

      if (data.actualRealEstateId) {
        await this.getRealEstate(data.actualRealEstateId);
        this.isCard = true;
      } else {
        this.realEstate = data;
      }
    },
    async successedSaved(data) {
      await this.getRealEstate(data);
    }
  },
  created() {
    // this.getRealEstateForGroup(this.data.uploadedRealEstateId);
  }
});
</script>
