<template>
  <div class="representativeDocumentWrapper">
    <BaseToolbar :canSave="true" @save="onSaveRepresentative" />
    <RepresentativeType
      :data="data.representativeType"
      @valueChanged="representativeTypeChanged"
    ></RepresentativeType>
    <RepresentativeDocumentsDataGrid
      :data="data.representativeDocuments"
      @valueChanged="representativeDocumentChanged"
    ></RepresentativeDocumentsDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RepresentativeType from "~/components/agency/statements/components/applicants/representativeDocuments/representative-type.vue";
import RepresentativeDocumentsDataGrid from "~/components/agency/statements/components/applicants/representativeDocuments/data-grid.vue";

export default Vue.extend({
  components: {
    BaseToolbar,
    RepresentativeType,
    RepresentativeDocumentsDataGrid,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      representativeType: this.data.representativeType,
      representativeDocuments: this.data.representativeDocuments,
    };
  },
  methods: {
    representativeTypeChanged(type) {
      this.representativeType = type;
    },
    representativeDocumentChanged(data) {
      this.representativeDocuments = data;
    },
    onSaveRepresentative() {
      this.$emit("representativeSaved", {
        representativeType: this.representativeType,
        representativeDocuments: this.representativeDocuments,
      });
    },
  },
});
</script>

<style lang="scss">
.representativeDocumentWrapper {
  width: 100%;
  height: 100%;
}
</style>

