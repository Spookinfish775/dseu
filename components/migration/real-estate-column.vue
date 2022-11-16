<template>
  <div>
    <p>
      <b
        >{{
          $t("migration.dataGrid.uploadedRealEstate.caseRealEstateType")
        }}:</b
      >
      {{ data.caseRealEstateType }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.address") }}:</b>
      {{ data.address }}
    </p>
    <p>
      <b
        >{{ $t("migration.dataGrid.uploadedRealEstate.realEstateMission") }}:</b
      >
      {{ data.realEstateMission }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.invertarNumber") }}:</b>
      {{ data.invertarNumber }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.square") }}:</b>
      {{ data.square }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.liveSquare") }}:</b>
      {{ data.liveSquare }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.flat") }}:</b>
      {{ data.flat }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.roomTotal") }}:</b>
      {{ data.roomTotal }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.cadastralNumber") }}:</b>
      {{ data.cadastralNumber }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.cadastralCost") }}:</b>
      {{ data.cadastralCost }}
    </p>
    <p>
      <b>{{ $t("migration.dataGrid.uploadedRealEstate.dealCost") }}:</b>
      {{ data.dealCost }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log(this.data);
  }
});
</script>
