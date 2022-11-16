<template>
  <div v-if="visible">
    <DxPopup
      :width="width"
      :height="height"
      :showTitle="showTitle"
      :title="title"
      :close-on-outside-click="closeOnOutsideClick"
      :visible.sync="visible"
      :deferRendering="deferRendering"
      :disabled="disabled"
      :dragEnabled="dragEnabled"
      :focusStateEnabled="focusStateEnabled"
      :fullScreen="fullScreen"
      :hint="hint"
      :hoverStateEnabled="hoverStateEnabled"
      :maxHeight="maxHeight"
      :maxWidth="maxWidth"
      :minHeight="minHeight"
      :minWidth="minWidth"
      :position="position"
      :resizeEnabled="resizeEnabled"
      :shading="shading"
      :showCloseButton="showCloseButton"
      :tabIndex="tabIndex"
      @hiding="close"
    >
      <DxScrollView width="100%" :height="height" :use-native="true">
        <slot> </slot>
        <div class="space-block"></div>
      </DxScrollView>
    </DxPopup>
  </div>
</template>

<script>
import Vue from "vue";
import { DxPopup } from "devextreme-vue/popup";
import { DxScrollView } from "devextreme-vue/scroll-view";

export default Vue.extend({
  components: {
    DxPopup,
    DxScrollView
  },
  props: {
    closeOnOutsideClick: { type: Boolean, default: false },
    deferRendering: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    dragEnabled: { type: Boolean, default: false },
    focusStateEnabled: { type: Boolean, default: true },
    fullScreen: { type: Boolean, default: false },
    hoverStateEnabled: { type: Boolean, default: false },
    showTitle: { type: Boolean, default: true },
    resizeEnabled: { type: Boolean, default: false },
    shading: { type: Boolean, default: true },
    showCloseButton: { type: Boolean, default: true },
    hint: { type: String, default: undefined },
    title: { type: String, default: "" },
    tabIndex: { type: Number, default: 0 },
    width: { default: null },
    height: { default: null },
    maxHeight: { default: null },
    maxWidth: { default: null },
    minHeight: { default: null },
    minWidth: { default: null },
    position: {
      default: () => {
        return { my: "center", at: "center", of: window };
      }
    }
  },
  popupController: { resolve: null, reject: null },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    open() {
      this.visible = true;
      const popupPromise = new Promise((ok, fail) => {
        this.$options.popupController.resolve = ok;
        this.$options.popupController.reject = fail;
      });
      return popupPromise;
    },
    close(data) {
      this.visible = false;
      this.$options.popupController.resolve(data);
    }
  }
});
</script>

<style lang="scss">
.space-block {
  height: 100px;
}
</style>
