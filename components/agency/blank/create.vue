<template>
  <div>
    <BaseToolbar :canSave="true" :canDelete="false" @save="createBlanks" />
    <DxForm ref="form" label-location="top" :form-data.sync="blank">
      <DxGroupItem>
        <DxSimpleItem data-field="organizationId" template="organization">
          <DxLabel location="left" :text="$t('labels.organization')" />
          <DxRequiredRule
            :message="$t('notifications.required.organization')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="numberFrom"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberOptions"
        >
          <DxLabel location="left" :text="$t('labels.numberFrom')" />
          <DxRequiredRule :message="$t('notifications.required.login')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="numberTo"
          data-type="string"
          editor-type="dxNumberBox"
          :editor-options="numberOptions"
        >
          <DxLabel location="left" :text="$t('labels.numberTo')" />
          <DxRequiredRule :message="$t('notifications.required.numberTo')" />
        </DxSimpleItem>
      </DxGroupItem>
      <template #organization>
        <OrganizationSelectBox
          :value="blank.organizationId"
          @valueChanged="organizationChanged"
        />
      </template>
    </DxForm>
  </div>
</template>

<script lang="ts">
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";
import Vue from "vue";
import DxForm, {
  DxGroupItem,
  DxSimpleItem,
  DxLabel,
  DxRequiredRule,
  DxButtonItem,
} from "devextreme-vue/form";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxProperties } from "~/infrastructure/components-properties/SelectBox/SelectBoxProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";

export default Vue.extend({
  components: {
    OrganizationSelectBox,
    BaseToolbar,
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
  },
  data() {
    return {
      blank: {
        numberFrom: 0,
        numberTo: 0,
        organizationId: null,
      },
    };
  },
  computed: {
    selectBoxOptions() {
      return new SelectBoxProperties({});
    },
    numberOptions() {
      return new NumberBoxProperties({});
    },
  },
  methods: {
    organizationChanged(value) {
      this.blank.organizationId = value;
    },
    createBlanks() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(`${this.$dataApi.blank}`, this.blank),
          (e) => {
            this.$awn.success();
            this.$emit("successedSaved", e.data);
          },
          (e) => {
            this.$awn.alert();
          }
        );
      }
    },
  },
});
</script>

<style scoped></style>
