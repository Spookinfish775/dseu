<template>
  <div id="navigation_menu_list">
    <DxTreeView
      :active-state-enabled="true"
      :search-enabled="false"
      search-mode="contains"
      search-expr="title"
      :items="items"
      @item-click="itemClick"
    >
      <template #item="{ data }">
        <ListMenuItem :data="data" />
      </template>
    </DxTreeView>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DxTreeView from "devextreme-vue/ui/tree-view";
import ListMenuItem from "./list-menu-item.vue";

export default Vue.extend({
  components: {
    DxTreeView,
    ListMenuItem,
  },
  computed: {
    items(): object[] {
      return this.$store.getters["menu/items"];
    },
  },
  methods: {
    itemClick(e: any) {
      this.$router.push(e.itemData.path);
    },
  },
});
</script>

<style lang="scss">
#navigation_menu_list {
  width: 250px;
  padding: 10px;
  .dx-treeview {
    white-space: wrap;

    .dx-treeview-item {
      padding-left: 0;
      padding-right: 20px;

      .dx-icon {
        width: 10px !important;
        margin: 0 !important;
      }
    }

    .dx-treeview-node {
      padding: 0 0 !important;
    }

    .dx-treeview-toggle-item-visibility {
      right: 10px;
      left: auto;
    }

    .dx-rtl .dx-treeview-toggle-item-visibility {
      left: 10px;
      right: auto;
    }

    .dx-treeview-node {
      &[aria-level="1"] {
        font-weight: bold;
        border-bottom: 1px solid $base-border-color;
      }

      &[aria-level="2"] .dx-treeview-item-content {
        font-weight: normal;
        padding: 0 0 0 10px;
      }
      // &[aria-level="2"] .dx-treeview-toggle-item-visibility {
      // 	display: none;
      // }
      // &[aria-level="2"] img {
      // 	display: none;
      // }
      &[aria-level="3"] .dx-treeview-item-content {
        // display: none;
        padding: 0 0 0 50px;
      }
    }
  }

  .dx-treeview {
    .dx-treeview-node-container {
      .dx-treeview-node {
        &.dx-state-selected:not(.dx-state-focused) > .dx-treeview-item {
          background: transparent;
        }

        &.dx-state-selected > .dx-treeview-item * {
          color: $base-accent;
        }

        &:not(.dx-state-focused) > .dx-treeview-item.dx-state-hover {
          background-color: inherit;
          color: $base-accent;
        }
        &.dx-state-focused > .dx-treeview-item.dx-state-hover {
          background-color: inherit;
        }
        &.dx-state-focused > .dx-treeview-item {
          color: $base-accent;
          background-color: inherit;
        }
      }
    }
  }
}
</style>
