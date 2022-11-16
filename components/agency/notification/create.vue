<template>
  <div>
    <BaseToolbar :canSave="canCreate" @save="onSave" />
    <DxForm ref="form" label-location="top" :form-data.sync="formData">
      <DxGroupItem :col-count="2" :caption="$t('labels.generalInformation')">
        <DxSimpleItem
          data-field="outgoingNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.outgoingNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="outgoingDate"
          data-type="date"
          editor-type="dxDateBox"
          :editor-options="outgoingDateOptions"
        >
          <DxLabel :text="$t('labels.outgoingDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="letterSenderOrganizationId"
          data-type="number"
          template="letterSenderOrganizationSelectBox"
        >
          <DxLabel :text="$t('labels.letterSenderOrganization')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="organizationId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="organizationSelectBox"
        >
          <DxLabel :text="$t('labels.organization')" />
          <DxRequiredRule />
        </DxSimpleItem>
      </DxGroupItem>
      <DxSimpleItem
        data-field="content"
        data-type="string"
        editor-type="dxTextArea"
        :editor-options="textAreaOptions"
      >
        <DxLabel :text="$t('labels.content')" />
      </DxSimpleItem>
      <template #letterSenderOrganizationSelectBox>
        <ApplicantSelectBox
          :value="formData.letterSenderOrganizationId"
          :filter="letterSenderOrganizationFilter"
          @valueChanged="value => (formData.letterSenderOrganizationId = value)"
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
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";

import { Notification } from "~/infrastructure/classes/agency/notification/Notification";
import { INotification } from "~/infrastructure/interfaces/agency/notification/INotification";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
    BaseToolbar,
    ApplicantSelectBox
  },
  data() {
    let formData: INotification = new Notification();
    return {
      formData
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "Notification"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "Notification"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "Notification"
      ];
      return PermissionControler.fullAccess(permission);
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    outgoingDateOptions() {
      return new DateBoxProperties();
    },
    letterSenderOrganizationFilter() {
      return ["applicantType", "=", ApplicantType.LetterSenderOrganization];
    },
    organizationSelectBox() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.organization + "/userOrganizations",
        displayExpr: "name"
      });
    }
  },
  methods: {
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(this.$dataApi.notification, this.formData),
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
