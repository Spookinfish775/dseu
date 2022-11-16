<template>
  <div>
    <RealEstateCreate
      v-if="realEstate && !isCard"
      :data="realEstate"
      :uploadedStateRegisterId="realEstate.id"
      :uploadedStateRegisters="uploadedStateRegisters"
      @successedSaved="successedSaved"
    />
    <RealEstateCard v-if="realEstate && isCard" :data="realEstate" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import RealEstateCard from "~/components/migration/tab-panel/real-estate/real-estate-card.vue";
import RealEstateCreate from "~/components/migration/tab-panel/real-estate/real-estate-create.vue";
import { RowType } from "~/infrastructure/enums/RowType";

export default Vue.extend({
  components: {
    RealEstateCard,
    RealEstateCreate
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    rowType: {
      type: String,
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
      return this.data.items.map(el => el.id);
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
    if (this.rowType === RowType.group) {
      this.getRealEstateForGroup(this.data.items[0].uploadedRealEstateId);
    }
  }
});
</script>
