<template>
  <div>
    <DxDataGrid
      :data-source="claims"
      :show-borders="true"
      :errorRowEnabled="false"
      :remote-operations="true"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :load-panel="{
        enabled: true,
        indicatorSrc: require('~/static/icons/loading.gif')
      }"
      @saved="onSaved"
    >
      <DxHeaderFilter :visible="true" />
      <DxSearchPanel position="after" :visible="true" />
      <DxStateStoring :enabled="true" type="localStorage" storage-key="claim" />
      <DxScrolling mode="virtual" />
      <DxEditing
        :allow-adding="canCreate"
        :allow-updating="canUpdate"
        :allow-deleting="fullAccess"
        :useIcons="true"
        mode="inline"
      />
      <DxColumn
        data-field="type"
        data-type="number"
        edit-cell-template="claimsEditor"
        :caption="$t('labels.claims')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="claimsDataSource"
        />
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="value"
        data-type="number"
        :caption="$t('labels.permission')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="permissionDataSource"
        />
        <DxRequiredRule />
      </DxColumn>
      <template #claimsEditor="{ data:cellInfo }">
        <DxSelectBox
          value-expr="id"
          display-expr="name"
          :value="cellInfo.value"
          :data-source="claimsEditorDataSource"
          @value-changed="e => claimsChanged(e, cellInfo)"
        />
      </template>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxLookup,
  DxRequiredRule,
  DxStateStoring,
  DxSearchPanel,
  DxHeaderFilter
} from "devextreme-vue/data-grid";
import DxSelectBox from "devextreme-vue/select-box";

import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";

import { Сlaims } from "~/infrastructure/data-sources/Сlaims";
import { Permissions } from "~/infrastructure/data-sources/Permissions";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling,
    DxLookup,
    DxRequiredRule,
    DxStateStoring,
    DxSearchPanel,
    DxHeaderFilter,
    DxSelectBox
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      claims: this.data,
      claimsDataSource: Сlaims(this),
      permissionDataSource: Permissions(this)
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["Role"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"]["Role"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"]["Role"];
      return PermissionControler.fullAccess(permission);
    },
    claimsFilter() {
      let filter = [];
      this.claims.forEach(claim => {
        filter.push(["id", "<>", claim.type]);
        filter.push("and");
      });
      filter.pop();
      if (filter.length === 0) return null;
      return filter;
    },
    claimsEditorDataSource() {
      return new DataSource({
        store: new ArrayStore({
          key: "id",
          data: Сlaims(this)
        }),
        filter: this.claimsFilter
      });
    }
  },
  methods: {
    claimsChanged(e, cellInfo) {
      cellInfo.setValue(e.value);
    },
    onSaved(e) {
      this.claims.forEach(samples => {
        delete samples["__KEY__"];
      });
      this.$emit("valueChanged", this.claims);
    }
  }
});
</script>

<style scoped></style>
