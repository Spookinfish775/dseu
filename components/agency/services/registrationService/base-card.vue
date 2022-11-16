<template>
  <div class="card-wrapper">
    <BaseToolbar
      v-if="!readOnly"
      :canSave="canUpdate"
      :canDelete="fullAccess"
      :canDownload="true"
      :canPrint="true"
      :haveCreateFrom="true"
      :haveCertificateReceiver="true"
      :haveNotificationPrint="true"
      :haveNotificationDownload="true"
      @print="onPrint"
      @save="onSave"
      @delete="onDelete"
      @download="onDownload"
      @createFrom="createFrom"
      @certificateReceiver="certificateReceiverOpen"
      @notificationPrint="onNotificationPrint"
      @notificationDownload="onNotificationDownload"
    />
    <DxForm
      ref="form"
      label-location="top"
      :form-data.sync="formData"
      :read-only="readOnly"
    >
      <DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
        <DxSimpleItem
          data-field="registrationStatementId"
          data-type="number"
          template="statementSelectBox"
        >
          <DxLabel :text="$t('labels.registrationStatement')" />
          <DxRequiredRule
            :message="$t('notifications.required.registrationStatement')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="index"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="chapterNumberOptions"
        >
          <DxLabel :text="$t('labels.chapterNumber')" />
          <DxRequiredRule
            :message="$t('notifications.required.chapterNumber')"
          />
        </DxSimpleItem>

        <DxSimpleItem
          data-field="enteredServiceDate"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="enteredServiceDateOptions"
        >
          <DxRequiredRule />
          <DxLabel :text="$t('labels.enteredServiceDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="systemServiceDate"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="systemDateOptions"
        >
          <DxLabel :text="$t('labels.systemDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="blankId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="blankOptions"
        >
          <DxLabel :text="$t('labels.blank')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="registrationServiceNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="registrationServiceNumberOptions"
        >
          <DxLabel :text="$t('labels.registrationServiceNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="certificateIndex"
          data-type="number"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.certificateIndex')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem :col-count="2">
        <DxSimpleItem
          data-field="certificateReceiver.whoTook"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="whoTookOptions"
        >
          <DxLabel :text="$t('labels.whoTook')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="certificateReceiver.whenTook"
          data-type="date"
          editor-type="dxDateBox"
          :editor-options="dateBoxOptions"
        >
          <DxLabel :text="$t('labels.whenTook')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxSimpleItem
        data-field="note"
        data-type="string"
        editor-type="dxTextArea"
        :col-span="2"
        :editor-options="textAreaOptions"
      >
        <DxLabel :text="$t('labels.note')" />
      </DxSimpleItem>
      <BasePopup
        ref="certificateReceiverPopup"
        width="70vw"
        height="70vh"
        :drag-enabled="false"
        :close-on-outside-click="true"
      >
        <CertificateReceiverCreate
          :data="formData.certificateReceiver"
          :registrationServiceId="data.id"
          @certificateReceiverSaved="certificateReceiverSaved"
          @certificateReceiverDeleted="certificateReceiverDeleted"
        />
      </BasePopup>
      <template #statementSelectBox>
        <StatementsSelectBox
          :value="formData.registrationStatementId"
          :filter="['statementType', '=', StatementType.RegistrationStatement]"
          :readOnly="readOnly"
          @valueChanged="registrationStatementChanged"
        />
      </template>
    </DxForm>
    <TypeSelector ref="typeSelector" :types="notificationTypes" />
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
  DxEmailRule,
  DxAsyncRule,
  DxPatternRule,
  DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";
import BasePopup from "~/components/page/popup.vue";
import CertificateReceiverCreate from "~/components/agency/services/registrationService/certificateReceiver-create.vue";
import TypeSelector from "~/components/layout/type-selector/index.vue";

import { StatementType } from "~/infrastructure/enums/StatementType";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IRegistrationService } from "~/infrastructure/interfaces/agency/services/IRegistrationService";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { blankState } from "~/infrastructure/enums/agency/blankState";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { BookType } from "~/infrastructure/enums/BookType";
import { NotificationTypes } from "~/infrastructure/data-sources/agency/NotificationTypes";
import loader from "sass-loader";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxEmailRule,
    DxPatternRule,
    DxAsyncRule,
    DxButtonItem,
    DxTextArea,
    BaseToolbar,
    StatementsSelectBox,
    DocumentEditorPopup,
    BasePopup,
    CertificateReceiverCreate,
    TypeSelector
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
    let formData: IRegistrationService = this.data;

    return {
      formData,
      StatementType,
      documentEditorVisible: false,
      documentEditorData: null
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "RefusalService"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "RefusalService"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "RefusalService"
      ];
      return PermissionControler.fullAccess(permission);
    },
    notificationTypes() {
        return NotificationTypes(this);
    },
    dateBoxOptions() {
      return new DateBoxProperties({
        readOnly: true
      });
    },
    whoTookOptions() {
      return new TextBoxProperties({
        readOnly: true
      });
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    registrationServiceNumberOptions() {
      return new TextBoxProperties({
        readOnly: true
      });
    },
    enteredServiceDateOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
        type: "datetime",
        applyValueMode: "useButtons"
      });
    },
    systemDateOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
        type: "datetime",
        readOnly: true
      });
    },
    blankOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.blank,
        filter: ["blankState", "=", blankState.Empty],
        displayExpr: "number"
      });
    },
    chapterNumberOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: `${this.$dataApi.chapterNumberRegistrationService}/${this.formData.registrationStatementId}`,
        filter: ["isUsed", "=", false],
        readOnly: this.formData.registrationStatementId == null,
        key: "number",
        displayExpr: "number",
        valueExpr: "number",
        searchExpr: "number"
      });
    },
    registrationStatementId() {
      return this.formData.registrationStatementId;
    },
    index() {
      return this.formData.index;
    },
    enteredServiceDate() {
      return this.formData.enteredServiceDate;
    }
  },
  watch: {
    registrationStatementId() {
      this.getRegistrationServiceNumber();
    },
    index() {
      this.getRegistrationServiceNumber();
    },
    enteredServiceDate() {
      this.getRegistrationServiceNumber();
    }
  },
  methods: {
    async getRegistrationServiceNumber() {
      if (
        this.registrationStatementId &&
        this.index &&
        this.enteredServiceDate
      ) {
        const { data } = await this.$axios.get(
          this.$dataApi.getRegistrationNumber,
          {
            params: {
              BookType: BookType.RegistrationServiceBook,
              RegistrationStatementId: this.registrationStatementId,
              Index: this.index,
              EnteredRegistrationDate: this.enteredServiceDate
            }
          }
        );
        this.formData.registrationServiceNumber = data;
      }
    },
    registrationStatementChanged(value) {
      this.formData.registrationStatementId = value;
    },
    onPrint() {
      if (this.documentEditorData === null) {
        this.$awn.asyncBlock(
          this.$axios.get(
            `${this.$dataApi.getHtml.registrationService}/${this.formData.id}`
          ),
          e => {
            this.$awn.success();
            this.documentEditorData = e.data;
            this.documentEditorVisible = true;
          },
          e => {
            this.$awn.alert();
          }
        );
      } else {
        this.documentEditorVisible = true;
      }
    },
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.put(
            `${this.$dataApi.services.registrationService}/${this.formData.id}`,
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
              `${this.$dataApi.services.registrationService}/${this.formData.id}`
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
    onDownload() {
      DocumentLoader.load(this, {
        loadUrl: `${this.$dataApi.download.registrationService}/${this.formData.id}`,
        name: `${this.$t("navigation.agency.registrationServiceTitle")} № ${
          this.formData.registrationServiceNumber
        }.docx`
      });
    },
    createFrom(statementType) {
      this.$router.push(
        `/agency/statements/createFrom?fromStatementType=${StatementType.RegistrationStatement}&statementId=${this.data.registrationStatementId}&createStatementType=${statementType.id}`
      );
    },
    certificateReceiverOpen() {
      this.$refs.certificateReceiverPopup.open();
    },
    certificateReceiverSaved(certificateReceiver) {
      if (!certificateReceiver.id) {
        this.$awn.asyncBlock(
          this.$axios.post(
            `${this.$dataApi.certificateReceiver}`,
            certificateReceiver
          ),
          e => {
            this.$awn.success();
            this.formData.certificateReceiver = e.data;
          },
          e => {
            this.$awn.alert();
          }
        );
      } else {
        this.$awn.asyncBlock(
          this.$axios.put(
            `${this.$dataApi.certificateReceiver}/${certificateReceiver.id}`,
            certificateReceiver
          ),
          e => {
            this.$awn.success();
            this.formData.certificateReceiver = certificateReceiver;
          },
          e => {
            this.$awn.alert();
          }
        );
      }
      this.$refs.certificateReceiverPopup.close();
    },
    certificateReceiverDeleted(id) {
      if (id) {
        this.$awn.asyncBlock(
          this.$axios.delete(`${this.$dataApi.certificateReceiver}/${id}`),
          e => {
            this.$awn.success();
            this.formData.certificateReceiver = null;
            this.$refs.certificateReceiverPopup.close();
          },
          e => {
            this.$awn.alert();
          }
        );
      }
    },
    async onNotificationDownload() {
      let result = await this.$refs["typeSelector"].open();
      if (result) {
        DocumentLoader.load(this, {
          loadUrl: `${this.$dataApi.download.notification}/?registrationServiceId=${this.formData.id}&notificationType=${result.id}`,
          name: `${this.$t("navigation.agency.notificationTitle")} № ${
            this.formData.registrationServiceNumber
          }.docx`
        });
      }
    },
    async onNotificationPrint() {
      let result = await this.$refs["typeSelector"].open();
      if (result) {
        this.$awn.asyncBlock(
          this.$axios.get(`${this.$dataApi.getHtml.notification}`, {
            params: {
              registrationServiceId: this.formData.id,
              notificationType: result.id
            }
          }),
          e => {
            this.$awn.success();
            this.documentEditorData = e.data;
            this.documentEditorVisible = true;
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
