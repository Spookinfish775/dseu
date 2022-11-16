<template>
  <div>
    <DxToolbar class="base-toolbar">
      <DxItem
        v-if="this.haveUploadFile"
        :options="uploadFileButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveCreateFrom"
        :options="createFromButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveCertificateReceiver"
        :options="certificateReceiverButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveConfirmationService"
        :options="confirmationServiceButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveLegalAidService"
        :options="legalAidServiceButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveGiveInformationService"
        :options="giveInformationServiceButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveChangeService"
        :options="changeServiceButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveSuspendService"
        :options="suspendServiceButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveSuspendStatement"
        :options="suspendStatementButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveRefusalService"
        :options="refusalServiceButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveRegistrationService"
        :options="registrationServiceButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveAnalisys"
        :options="analisysButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.havePayment"
        :options="paymentButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveDocument"
        :options="documentButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.canChangeStatus"
        :options="changeButtonOptions"
        location="after"
        widget="dxButton"
      />
      <DxItem
        v-if="this.canDownload"
        :options="downloadButtonOptions"
        location="after"
        widget="dxButton"
      />
      <DxItem
        v-if="this.canPrint"
        :options="printButtonOptions"
        location="after"
        widget="dxButton"
      />
      <DxItem
        v-if="this.canSave"
        :options="saveButtonOptions"
        location="after"
        widget="dxButton"
      />
      <DxItem
        v-if="this.canDelete"
        :options="deleteButtonOptions"
        location="after"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveNotificationPrint"
        :options="notificationPrintButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        v-if="this.haveNotificationDownload"
        :options="notificationDownloadButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
    </DxToolbar>
    <TypeSelector ref="typeSelector" :types="statementTypes" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import TypeSelector from "~/components/layout/type-selector/index.vue";
import DxDropDownButton from "devextreme-vue/drop-down-button";
import { StatementTypes } from "~/infrastructure/data-sources/StatementTypes";

export default Vue.extend({
  components: {
    DxToolbar,
    DxItem,
    DxDropDownButton,
    TypeSelector
  },
  props: {
    canSave: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canChangeStatus: {
      type: Boolean,
      default: false
    },
    canDownload: {
      type: Boolean,
      default: false
    },
    canPrint: {
      type: Boolean,
      default: false
    },
    haveDocument: {
      type: Boolean,
      default: false
    },
    isCard: {
      type: Boolean,
      default: false
    },
    havePayment: {
      type: Boolean,
      default: false
    },
    haveAnalisys: {
      type: Boolean,
      default: false
    },
    haveRegistrationService: {
      type: Boolean,
      default: false
    },
    haveRefusalService: {
      type: Boolean,
      default: false
    },
    haveSuspendStatement: {
      type: Boolean,
      default: false
    },
    haveSuspendService: {
      type: Boolean,
      default: false
    },
    haveChangeService: {
      type: Boolean,
      default: false
    },
    haveGiveInformationService: {
      type: Boolean,
      default: false
    },
    haveLegalAidService: {
      type: Boolean,
      default: false
    },
    haveConfirmationService: {
      type: Boolean,
      default: false
    },
    haveCreateFrom: {
      type: Boolean,
      default: false
    },
    haveCertificateReceiver: {
      type: Boolean,
      default: false
    },
    haveUploadFile: {
      type: Boolean,
      default: false
    },
    haveNotificationPrint: {
      type: Boolean,
      default: false
    },
    haveNotificationDownload: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statementTypes() {
      return StatementTypes(this);
    },
    uploadFileButtonOptions() {
      return {
        icon: "upload",
        type: "normal",
        visible: this.haveUploadFile,
        useSubmitBehavior: true,
        text: this.$t("buttons.uploadFile"),
        hint: this.$t("buttons.uploadFile"),
        onClick: () => {
          this.$store.commit("file-manager/OPEN_MANAGER");
        }
      };
    },
    createFromButtonOptions() {
      return {
        icon: "exportselected",
        type: "normal",
        visible: this.haveCreateFrom,
        useSubmitBehavior: true,
        text: this.$t("buttons.createFrom"),
        hint: this.$t("buttons.createFrom"),
        onClick: async () => {
          let result = await this.$refs["typeSelector"].open();
          this.$emit("createFrom", result);
        }
      };
    },
    notificationPrintButtonOptions() {
      return {
        icon: "print",
        type: "normal",
        visible: this.haveNotificationPrint,
        useSubmitBehavior: true,
        text: this.$t("buttons.notificationPrint"),
        hint: this.$t("buttons.notificationPrint"),
        onClick: async () => {
          this.$emit("notificationPrint");
        }
      };
    },
    notificationDownloadButtonOptions() {
      return {
        icon: "download",
        type: "normal",
        visible: this.haveNotificationDownload,
        useSubmitBehavior: true,
        text: this.$t("buttons.notificationDownload"),
        hint: this.$t("buttons.notificationDownload"),
        onClick: async () => {
          this.$emit("notificationDownload");
        }
      };
    },
    certificateReceiverButtonOptions() {
      return {
        icon: "card",
        type: "normal",
        visible: this.haveCertificateReceiver,
        useSubmitBehavior: true,
        text: this.$t("buttons.certificateReceiver"),
        hint: this.$t("buttons.certificateReceiver"),
        onClick: () => {
          this.$emit("certificateReceiver");
        }
      };
    },
    confirmationServiceButtonOptions() {
      return {
        icon: "doc",
        type: "normal",
        visible: this.haveConfirmationService,
        useSubmitBehavior: true,
        text: this.$t("buttons.confirmationService"),
        hint: this.$t("buttons.confirmationService"),
        onClick: () => this.$emit("confirmationService")
      };
    },
    legalAidServiceButtonOptions() {
      return {
        icon: "doc",
        type: "normal",
        visible: this.haveLegalAidService,
        useSubmitBehavior: true,
        text: this.$t("buttons.legalAidService"),
        hint: this.$t("buttons.legalAidService"),
        onClick: () => this.$emit("legalAidService")
      };
    },
    giveInformationServiceButtonOptions() {
      return {
        icon: "doc",
        type: "normal",
        visible: this.haveGiveInformationService,
        useSubmitBehavior: true,
        text: this.$t("buttons.giveInformationService"),
        hint: this.$t("buttons.giveInformationService"),
        onClick: () => this.$emit("giveInformationService")
      };
    },
    changeServiceButtonOptions() {
      return {
        icon: "doc",
        type: "normal",
        visible: this.haveChangeService,
        useSubmitBehavior: true,
        text: this.$t("buttons.changeService"),
        hint: this.$t("buttons.changeService"),
        onClick: () => this.$emit("changeService")
      };
    },
    suspendServiceButtonOptions() {
      return {
        icon: "/icons/registrationStatement/registrationService.svg",
        type: "normal",
        visible: this.haveSuspendService,
        useSubmitBehavior: true,
        text: this.$t("buttons.suspendService"),
        hint: this.$t("buttons.suspendService"),
        onClick: () => this.$emit("suspendService")
      };
    },
    suspendStatementButtonOptions() {
      return {
        icon: "/icons/registrationStatement/suspendStatement.svg",
        type: "normal",
        visible: this.haveSuspendStatement,
        useSubmitBehavior: true,
        text: this.$t("buttons.suspendStatement"),
        hint: this.$t("buttons.suspendStatement"),
        onClick: () => this.$emit("suspendStatement")
      };
    },
    refusalServiceButtonOptions() {
      return {
        icon: "/icons/registrationStatement/refusalService.svg",
        type: "normal",
        visible: this.haveRefusalService,
        useSubmitBehavior: true,
        text: this.$t("buttons.refusalService"),
        hint: this.$t("buttons.refusalService"),
        onClick: () => this.$emit("refusalService")
      };
    },
    registrationServiceButtonOptions() {
      return {
        icon: "/icons/registrationStatement/registrationService.svg",
        type: "normal",
        visible: this.haveRegistrationService,
        useSubmitBehavior: true,
        text: this.$t("buttons.registrationService"),
        hint: this.$t("buttons.registrationService"),
        onClick: () => this.$emit("registrationService")
      };
    },
    analisysButtonOptions() {
      return {
        icon: "/icons/registrationStatement/analysisProcess.svg",
        type: "normal",
        visible: this.haveAnalisys,
        useSubmitBehavior: true,
        text: this.$t("buttons.analysisProcess"),
        hint: this.$t("buttons.analysisProcess"),
        onClick: () => this.$emit("analysisProcess")
      };
    },
    paymentButtonOptions() {
      return {
        icon: "/icons/registrationStatement/payment.svg",
        type: "normal",
        visible: this.havePayment,
        useSubmitBehavior: true,
        text: this.$t("buttons.payment"),
        hint: this.$t("buttons.payment"),
        onClick: () => this.$emit("payment")
      };
    },
    downloadButtonOptions() {
      return {
        icon: "/icons/registrationStatement/download.svg",
        type: "normal",
        visible: this.canDownload,
        useSubmitBehavior: true,
        text: this.$t("buttons.download"),
        hint: this.$t("buttons.download"),
        onClick: () => this.$emit("download")
      };
    },
    printButtonOptions() {
      return {
        icon: "/icons/registrationStatement/print.svg",
        type: "normal",
        visible: this.canPrint,
        useSubmitBehavior: true,
        text: this.$t("buttons.print"),
        hint: this.$t("buttons.print"),
        onClick: () => this.$emit("print")
      };
    },
    documentButtonOptions() {
      return {
        icon: "doc",
        type: "normal",
        visible: this.haveDocument,
        useSubmitBehavior: true,
        text: this.$t("buttons.document"),
        hint: this.$t("buttons.document"),
        onClick: () => this.$emit("document")
      };
    },
    deleteButtonOptions() {
      return {
        icon: "trash",
        type: "danger",
        visible: this.canDelete,
        useSubmitBehavior: true,
        text: this.$t("buttons.delete"),
        hint: this.$t("buttons.delete"),
        onClick: () => this.$emit("delete")
      };
    },
    saveButtonOptions() {
      return {
        icon: "save",
        type: "success",
        visible: this.canSave,
        useSubmitBehavior: true,
        text: this.$t("buttons.save"),
        hint: this.$t("buttons.save"),
        onClick: () => this.$emit("save")
      };
    },
    changeButtonOptions() {
      return {
        type: "success",
        visible: this.canChangeStatus,
        useSubmitBehavior: true,
        text: this.$t("buttons.changeStatus"),
        hint: this.$t("buttons.changeStatus"),
        onClick: () => this.$emit("changeStatus")
      };
    }
  }
});
</script>

<style lang="scss">
.base-toolbar {
  margin: 0 0 10px 0;
}
</style>
