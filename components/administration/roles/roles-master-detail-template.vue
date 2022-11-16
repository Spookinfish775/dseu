<template>
  <div>
    <DxDataGrid
      height="400px"
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
      @toolbar-preparing="toolbarPreparing"
      @saved="save"
    >
      <DxHeaderFilter :visible="true" />
      <DxSearchPanel position="after" :visible="true" />
      <DxStateStoring :enabled="true" type="localStorage" storage-key="claim" />
      <DxScrolling mode="virtual" />
      <DxEditing
        :allow-adding="false"
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
    <BasePopup ref="claims-create-popup" width="70vw" height="70vh" :show-title="true">
      <ClaimCreateCard
        :claims="claims"
        :templateData="templateData"
        @successedSaved="successedSavedNewClaims"
      />
    </BasePopup>
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

import ClaimCreateCard from "./create-claim-card.vue";
import BasePopup from "~/components/page/popup.vue";
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
    DxSelectBox,
    DxSearchPanel,
    DxHeaderFilter,
    ClaimCreateCard,
    BasePopup
  },
  props: {
    templateData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      claims: [],
      claimsDataSource: Сlaims(this),
      permissionDataSource: Permissions(this)
    };
  },
  computed: {
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"]["Role"];
      return PermissionControler.canUpdate(permission);
    },
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["Role"];
      return PermissionControler.canCreate(permission);
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
    successedSavedNewClaims(claims) {
      this.claims = claims;
      this.$refs["claims-create-popup"].close();
    },
    claimsChanged(e, cellInfo) {
      cellInfo.setValue(e.value);
    },
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "plus",
            visible: this.canCreate,
            displayExpr: "name",
            onClick: () => {
              this.$refs["claims-create-popup"].open();
            }
          }
        },
        ...e.toolbarOptions.items
      ];
    },
    async save(e) {
      try {
        this.claims.forEach(claim => {
          delete claim["__KEY__"];
        });
        this.$axios.put(`${this.$dataApi.role}/${this.templateData.id}`, {
          claims: this.claims,
          ...this.templateData
        });
      } catch (error) {
        throw error;
      }
    }
  },
  async created() {
    try {
      let { data } = await this.$axios.get(
        `${this.$dataApi.role}/${this.templateData.id}`
      );
      this.claims = data.claims;
    } catch (error) {
      throw error;
    }
  }
});
</script>
