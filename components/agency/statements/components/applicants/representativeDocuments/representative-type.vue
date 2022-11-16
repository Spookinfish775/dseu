<template>
  <div class="representative-type-selectbox">
    <DxSelectBox
      ref="selectBox"
      :data-source="dataSource"
      value-expr="id"
      display-expr="name"
      :search-enabled="true"
      :value.sync="value"
      @value-changed="valueChanged"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";

import { RepresentativeTypes } from "~/infrastructure/data-sources/RepresentativeTypes";
import { RepresentativeType } from "~/infrastructure/enums/RepresentativeType";

export default Vue.extend({
  components: {
    DxSelectBox,
  },
  props: {
    data: {
      type: Number,
      default: RepresentativeType.Owner,
    },
  },
  data() {
    return {
      value: this.data,
      dataSource: RepresentativeTypes(this).filter(
        (el) => el.id != RepresentativeType.None
      ),
    };
  },
  methods: {
    valueChanged(value) {
      this.$emit("valueChanged", value.value);
    },
  },
});
</script>

<style lang="scss">
.representative-type-selectbox {
  margin-bottom: 30px;
}
</style>
