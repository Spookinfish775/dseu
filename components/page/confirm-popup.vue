<template>
  <div v-if="visible">
    <DxPopup
      :max-height="maxHeight"
      :max-width="maxWidth"
      :close-on-outside-click="false"
      :showCloseButton="false"
      :show-title="false"
      :visible.sync="visible"
      :position="position"
    >
      <DxToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        :options="emailButtonOptions"
      />
      <DxToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        :options="closeButtonOptions"
      />
      <p class="message">
        {{ message }}
      </p>
    </DxPopup>
  </div>
</template>

<script>
import Vue from "vue";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import { DxScrollView } from "devextreme-vue/scroll-view";

export default Vue.extend({
  components: {
    DxPopup,
    DxScrollView,
    DxToolbarItem
  },
  props: {
    message: { default: null },
    maxHeight: { default: "200px" },
    maxWidth: { default: "400px" },
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
  computed: {
    emailButtonOptions() {
      return {
        icon: "todo",
        text: this.$t("buttons.confirm"),
        onClick: () => {
          this.close(true);
        }
      };
    },
    closeButtonOptions() {
      return {
        icon: "close",
        text: this.$t("buttons.reject"),
        onClick: () => {
          this.close(false);
        }
      };
    }
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
.message {
  font-size: 1.3em;
}
</style>
