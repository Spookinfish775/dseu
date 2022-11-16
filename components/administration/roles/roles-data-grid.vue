<template>
  <div>
    <DxDataGrid
      height="80vh"
      :data-source="roles"
      :show-borders="true"
      :hoverStateEnabled="true"
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
      @row-dbl-click="beginEdit"
    >
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxGrouping :auto-expand-all="false" />
      <DxColumnChooser :enabled="true" />
      <DxColumnFixing :enabled="true" />
      <DxSearchPanel position="after" :visible="true" />
      <DxScrolling mode="virtual" />
      <DxPaging :enabled="true" :page-size="10" />
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
        :file-name="$t('navigation.administration.rolesTitle')"
      />
      <DxStateStoring :enabled="true" type="localStorage" storage-key="role" />
      <DxEditing
        :allow-adding="canCreate"
        :allow-updating="false"
        :allow-deleting="fullAccess"
        :useIcons="true"
        mode="row"
      />

      <DxColumn
        data-field="name"
        data-type="string"
        :caption="$t('labels.name')"
      >
        <DxRequiredRule />
      </DxColumn>
      <DxColumn :width="100" :buttons="editButtons" type="buttons" />
    </DxDataGrid>
    <BasePopup
      ref="roles-claims-popup"
      width="70vw"
      height="70vh"
      :show-title="true"
      :title="`${popupTitle} ${$t('labels.claims')}`"
    >
      <RolesMasterDetailTemplate :template-data="currentRow" />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxSearchPanel,
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxRequiredRule,
  DxStateStoring,
  DxFilterRow,
  DxPaging,
  DxHeaderFilter,
  DxGrouping,
  DxGroupPanel,
  DxExport,
  DxColumnChooser,
  DxColumnFixing
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import RolesMasterDetailTemplate from "./roles-master-detail-template.vue";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxSearchPanel,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling,
    DxRequiredRule,
    DxStateStoring,
    DxFilterRow,
    DxPaging,
    DxHeaderFilter,
    DxGrouping,
    DxGroupPanel,
    DxExport,
    DxColumnChooser,
    DxColumnFixing,
    BasePopup,
    RolesMasterDetailTemplate
  },
  data() {
    return {
      roles: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.role,
          insertUrl: this.$dataApi.role,
          removeUrl: this.$dataApi.role,
          updateUrl: this.$dataApi.role
        }),
        filter: ["name", "<>", "Administrator"],
        sort: "name"
      }),
      currentRow: null
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
    popupTitle() {
      return this.currentRow?.name;
    },
    editButtons() {
      return [
        {
          hint: this.$t("labels.createFrom"),
          icon: "copy",
          onClick: e => {
            this.existRole(e.row.data.id);
          }
        },
        {
          hint: this.$t("labels.edit"),
          icon: "edit",
          onClick: e => {
            this.currentRow = e.row.data;
            this.$refs["roles-claims-popup"].open();
          }
        },
        "delete"
      ];
    }
  },
  methods: {
    beginEdit(e) {
      this.currentRow = e.data;
      this.$refs["roles-claims-popup"].open();
    },
    async existRole(roleId) {
      await this.$axios.post(`${this.$dataApi.role}/existingRole/${roleId}`, {
        id: roleId
      });
      this.roles.reload();
    },
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh"
          },
          onClick: () => {
            this.roles.reload();
          }
        },
        ...e.toolbarOptions.items
      ];
    }
  }
});
</script>
