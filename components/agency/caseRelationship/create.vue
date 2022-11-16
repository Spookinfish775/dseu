<template>
  <div>
    <BaseToolbar :canSave="canCreate" @save="onSave" />
    <DxForm ref="form" label-location="top" :form-data.sync="formData">
      <DxGroupItem :col-count="2" :caption="$t('labels.generalInformation')">
        <DxSimpleItem
          data-field="caseParentId"
          data-type="number"
          template="caseParentSelectBox"
        >
          <DxLabel :text="$t('labels.caseParent')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="caseChildId"
          data-type="number"
          template="caseChildSelectBox"
        >
          <DxLabel :text="$t('labels.caseChild')" />
          <DxRequiredRule />
        </DxSimpleItem>
      </DxGroupItem>
      <template #caseParentSelectBox>
        <CaseSelectBox
          :value="formData.caseParentId"
          @valueChanged="val => (formData.caseParentId = val)"
        />
      </template>
      <template #caseChildSelectBox>
        <CaseSelectBox
          :value="formData.caseChildId"
          @valueChanged="val => (formData.caseChildId = val)"
        />
      </template>
    </DxForm>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DxForm, {
  DxGroupItem,
  DxSimpleItem,
  DxLabel,
  DxRequiredRule,
  DxButtonItem
} from "devextreme-vue/form";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import CaseSelectBox from "~/components/case/select-box/index.vue";

import { CaseRelationship } from "~/infrastructure/classes/agency/CaseRelationship";
import { ICaseRelationship } from "~/infrastructure/interfaces/agency/ICaseRelationship";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
    BaseToolbar,
    CaseSelectBox
  },
  data() {
    let formData: ICaseRelationship = new CaseRelationship();
    return {
      formData
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "CaseRelationship"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "CaseRelationship"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "CaseRelationship"
      ];
      return PermissionControler.fullAccess(permission);
    }
  },
  methods: {
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(this.$dataApi.caseRelationship, this.formData),
          e => {
            this.$awn.success();
            this.$emit("successedSaved", e.data);
          },
          e => {
            this.$awn.alert();
          }
        );
      }
    }
  }
});
</script>
