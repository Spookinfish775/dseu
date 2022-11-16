<template>
  <div>
    <BaseToolbar :canSave="canCreate" @save="onSave" />
    <DxForm
      ref="form"
      label-location="top"
      :form-data.sync="formData"
      :col-count="2"
    >
      <DxSimpleItem
        data-field="claims"
        data-type="array"
        editor-type="dxTagBox"
        :editor-options="claimsOptions"
      >
        <DxLabel :text="$t('labels.permission')" />
        <DxRequiredRule />
      </DxSimpleItem>
      <DxSimpleItem
        data-field="permission"
        data-type="number"
        editor-type="dxSelectBox"
        :editor-options="permissionsOptions"
      >
        <DxLabel :text="$t('labels.permission')" />
        <DxRequiredRule />
      </DxSimpleItem>
    </DxForm>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DxForm, {
  DxSimpleItem,
  DxLabel,
  DxRequiredRule
} from "devextreme-vue/form";
import DxTagBox from "devextreme-vue/tag-box";

import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TagBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/TagBox/TagBoxPropertiesWithLocalData";
import { Сlaims } from "~/infrastructure/data-sources/Сlaims";
import { Permissions } from "~/infrastructure/data-sources/Permissions";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    BaseToolbar,
    DxTagBox,
    DxForm,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule
  },
  props: {
    claims: {
      type: Array,
      required: true
    },
    templateData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        claims: [],
        permission: null
      }
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["User"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"]["User"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"]["User"];
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
    claimsOptions() {
      return new TagBoxPropertiesWithLocalData({
        dataSource: new DataSource({
          store: new ArrayStore({
            key: "id",
            data: Сlaims(this)
          }),
          filter: this.claimsFilter,
          sort: "name"
        }),
        searchEnabled: true
      });
    },
    permissionsOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: Permissions(this)
      });
    }
  },
  methods: {
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        let claims = this.formData.claims.map(el => {
          return {
            type: el,
            value: this.formData.permission
          };
        });
        claims = [...claims, ...this.claims];
        try {
          this.$axios.put(`${this.$dataApi.role}/${this.templateData.id}`, {
            claims,
            ...this.templateData
          });
          this.$emit("successedSaved", claims);
        } catch (error) {
          throw error;
        }
      }
    }
  }
});
</script>
