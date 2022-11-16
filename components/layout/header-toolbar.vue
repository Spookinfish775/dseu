<template>
  <header>
    <DxToolbar>
      <DxItem location="before" widget="dxButton" :options="toggleMenuBtn" />
      <DxItem location="after" template="logo" />

      <template #logo>
        <nuxt-link no-prefetch to="/">
          <i class="header-logo" />
        </nuxt-link>
      </template>
    </DxToolbar>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import SearchForm from "~/components/layout/searchForm/index.vue";

export default Vue.extend({
  components: {
    DxToolbar,
    DxItem,
    SearchForm,
  },
  data() {
    return {
      logo: require("~/static/icons/main-logo.svg"),
    };
  },
  computed: {
    toggleMenuBtn(): object {
      return {
        icon: "menu",
        stylingMode: "text",
        type: "normal",
        onClick: () => {
          this.$emit("toggleMenu");
        },
      };
    },
  },
});
</script>

<style lang="scss" scoped>
header {
  padding: 13px 10px;
  min-height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $base-border-color;
  background-color: #fff;
  .header-logo {
    display: block;
    height: 35px;
    width: 85px;
    margin: 0 20px 0 10px;
    background: url("/icons/main-logo.svg") center no-repeat;
    background-size: cover;
  }
}
</style>
