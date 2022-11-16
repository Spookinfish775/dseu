<template>
  <div>
    <BaseToolbar
      :canSave="canUpdate"
      :canDelete="fullAccess"
      :canDownload="true"
      :canPrint="true"
      @save="onSave"
      @delete="onDelete"
      @download="onDownload"
      @print="onPrint"
    />

    <DxForm
      ref="form"
      label-location="top"
      :read-only="readOnly"
      :form-data.sync="formData"
    >
      <DxGroupItem :col-count="8" :caption="$t('labels.generalInformation')">
        <DxSimpleItem
          data-field="outgoingNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.outgoingNumber')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem :col-count="2">
        <DxSimpleItem
          data-field="organizationId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="organizationSelectBox"
        >
          <DxLabel :text="$t('labels.organization')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="userId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="userOptions"
        >
          <DxLabel :text="$t('labels.executor')" />
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
          data-field="executionTime"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="executionTimeOptions"
        >
          <DxLabel :text="$t('labels.systemDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="letterSenderOrganizationId"
          data-type="number"
          template="letterSenderOrganizationSelectBox"
        >
          <DxLabel :text="$t('labels.letterSenderOrganization')" />
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
    <!-- <TypeSelector ref="typeSelector" :types="notificationTypes" />  -->
    <DocumentEditorPopup
      v-model="documentEditorVisible"
      :data="documentEditorData"
    />
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
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";
// import TypeSelector from "~/components/layout/type-selector/index.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";

import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { INotification } from "~/infrastructure/interfaces/agency/notification/INotification";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
// import { NotificationType } from "~/infrastructure/enums/agency/NotificationType";
// import { NotificationTypes } from "~/infrastructure/data-sources/agency/NotificationTypes";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
    BaseToolbar,
    ApplicantSelectBox,
    DocumentEditorPopup,
    // TypeSelector
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let formData: INotification = this.data;
    return {
      formData,
      documentEditorVisible: false,
      documentEditorData: null
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
    // notificationTypes() {
    //   if (this.formData.serviceId) {
    //     return NotificationTypes(this).filter(
    //       el => el.id !== NotificationType.Gornush_83
    //     );
    //   }
    //   if (this.formData.statementId) {
    //     return NotificationTypes(this).filter(
    //       el => el.id === NotificationType.Gornush_83
    //     );
    //   }
    // },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    outgoingDateOptions() {
      return new DateBoxProperties();
    },
    executionTimeOptions() {
      return new DateBoxProperties({
        readOnly: true
      });
    },
    letterSenderOrganizationFilter() {
      return ["applicantType", "=", ApplicantType.LetterSenderOrganization];
    },
    organizationSelectBox() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.organization + "/userOrganizations",
        displayExpr: "name"
      });
    },
    userOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.user,
        displayExpr: "fullName",
        readOnly: true
      });
    }
  },
  methods: {
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.put(
            `${this.$dataApi.notification}/${this.formData.id}`,
            this.formData
          ),
          e => {
            this.$awn.success();
            this.$emit("successedSaved", e.data);
          },
          e => {
            this.$awn.alert();
          }
        );
      }
    },
    onDelete() {
      const result = confirm(
        this.$t("notifications.confirm.areYouSure"),
        this.$t("notifications.confirm.index")
      );
      result.then(dialogResult => {
        if (dialogResult) {
          this.$awn.asyncBlock(
            this.$axios.delete(
              `${this.$dataApi.notification}/${this.formData.id}`
            ),
            e => {
              this.$awn.success();
              this.$emit("successedDeleted");
            },
            e => {
              this.$awn.alert();
            }
          );
        }
      });
    },
    async onDownload() {
           DocumentLoader.load(this, {
          loadUrl: `${this.$dataApi.download.notification}/${this.formData.id}`,
          name: `${this.$t("navigation.agency.notificationTitle")} № ${
            this.formData.id
          }.docx`});
      // let result = await this.$refs["typeSelector"].open();
      // if (result) {
      //   DocumentLoader.load(this, {
      //     loadUrl: `${this.$dataApi.download.notification}/${this.formData.id}?id=${this.formData.id}&notificationType=${result.id}`,
      //     name: `${this.$t("navigation.agency.notificationTitle")} № ${
      //       this.formData.id
      //     }.docx`
      //   });
      // }
    },
    async onPrint() {
        this.$awn.asyncBlock(
          this.$axios.get(`${this.$dataApi.getHtml.notification}/${this.formData.id}`),
          e => {
            this.$awn.success();
            this.documentEditorData = e.data;
            this.documentEditorVisible = true;
          },
          e => {
            this.$awn.alert();
          }
        );
      // let result = await this.$refs["typeSelector"].open();
      // if (result) {
      //   this.$awn.asyncBlock(
      //     this.$axios.get(`${this.$dataApi.getHtml.notification}`, {
      //       params: {
      //         id: this.formData.id,
      //         notificationType: result.id
      //       }
      //     }),
      //     e => {
      //       this.$awn.success();
      //       this.documentEditorData = e.data;
      //       this.documentEditorVisible = true;
      //     },
      //     e => {
      //       this.$awn.alert();
      //     }
      //   );
      // }
    }
  },
});
</script>
