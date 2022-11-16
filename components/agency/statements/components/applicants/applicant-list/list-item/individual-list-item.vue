<template>
  <div id="individual-list-item">
    <i />
    <div>
      <p>
        <b>{{ $t("labels.fullName") }}:</b>
        {{ data.firstName }}
        {{ data.lastName }}
        {{ data.middleName }}
      </p>
      <p>
        <b>{{ $t("labels.registration") }}:</b>
        {{ data.registration }}
      </p>
      <p>
        <b>{{ $t("labels.representativeStatus") }}:</b>
        {{ applicantStatusName }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { RepresentativeTypes } from "~/infrastructure/data-sources/RepresentativeTypes";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true,
    },
    applicantStatement: {
      type: Object,
      required: true,
    },
  },
  computed: {
    applicantStatusName() {
      return RepresentativeTypes(this).find(
        (element) =>
          element.id === this.applicantStatement.statementApplicantStatus
      ).name;
    },
  },
});
</script>

<style lang="scss">
#individual-list-item {
  display: flex;
  align-items: center;
  position: relative;
  i {
    width: 30px;
    height: 30px;
    margin: 0 10px 0 0;
    background: url("/icons/applicantType/individual.svg") center no-repeat;
    background-size: cover;
  }
}
</style>