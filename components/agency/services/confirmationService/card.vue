<template>
  <div class="card-wrapper">
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
      :form-data.sync="formData"
      :read-only="readOnly"
    >
      <DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
        <DxSimpleItem
          data-field="confirmationStatementId"
          data-type="number"
          template="statementSelectBox"
        >
          <DxLabel :text="$t('labels.confirmationStatement')" />
          <DxRequiredRule />
        </DxSimpleItem>
         <DxSimpleItem
          data-field="confirmationServiceIndex"
          data-type="string"
          editor-type="dxTextBox"
        >
          <DxLabel :text="$t('labels.confirmationServiceIndex')" />
        </DxSimpleItem>

        <DxSimpleItem
          data-field="test"
          data-type="array"
          template="registrationServiceTagBox"
        >
          <DxLabel :text="$t('labels.registrationServices')" />
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
          data-type="date"
          editor-type="dxDateBox"
          :editor-options="executionTimeOptions"
        >
          <DxLabel :text="$t('labels.systemDate')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem :col-span="2" :col-count="2">
        <DxSimpleItem
          data-field="foundAddresses"
          data-type="string"
          editor-type="dxTextArea"
          :col-span="2"
          :editor-options="foundAddressesOptions"
        >
          <DxLabel :text="$t('labels.foundedAddresses')" />
        </DxSimpleItem>
      </DxGroupItem>
      <template #statementSelectBox>
        <StatementsSelectBox
          :value="formData.confirmationStatementId"
          :filter="['statementType', '=', StatementType.LegalAidStatement]"
          :readOnly="readOnly || confirmationStatementId != null"
          @valueChanged="value => (formData.confirmationStatementId = value)"
        />
      </template>
      <template #registrationServiceTagBox>
        <RegistrationServiceTagBox
          :value="formData.registrationServices"
          :confirmationStatementId="formData.confirmationStatementId"
          :readOnly="readOnly || !formData.confirmationStatementId"
          @valueChanged="registrationServicesChanged"
        />
      </template>
    </DxForm>
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
import RegistrationServiceTagBox from "~/components/agency/services/registrationService/tag-box/index.vue";

import { StatementType } from "~/infrastructure/enums/StatementType";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IConfirmationService } from "~/infrastructure/interfaces/agency/services/IConfirmationService";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

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
    RegistrationServiceTagBox
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    confirmationStatementId: {
      type: Number,
      default: null
    }
  },
  data() {
    let formData: IConfirmationService = this.data;

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
        "ConfirmationService"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "ConfirmationService"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "ConfirmationService"
      ];
      return PermissionControler.fullAccess(permission);
    },
    enteredServiceDateOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
        type: "datetime",
        applyValueMode: "useButtons"
      });
    },
    executionTimeOptions() {
      return new DateBoxProperties({
        readOnly: true
      });
    },
    userOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.user,
        displayExpr: "fullName",
        readOnly: true
      });
    },
    confirmationStatement() {
      return this.formData.confirmationStatementId;
    },
    foundAddressesOptions() {
      return new TextAreaProperties();
    },
    registrationServices() {
      return this.formData.registrationServices;
    }
  },
  watch: {
    confirmationStatement() {
      this.formData.registrationServices = [];
    },
    registrationServices(val) {
      if (val.length) this.getRealEstateAddress();
    }
  },
  methods: {
    async getRealEstateAddress() {
      let query = ``;
      this.registrationServices.forEach((el, index, arr) => {
        query += `RegistrationServices=${el}`;
        if (index + 1 !== arr.length) {
          query += `&`;
        }
      });
      const { data } = await this.$axios.get(
        `${this.$dataApi.realEstate}/registrationService?${query}`
      );
      this.formData.foundAddresses = data.data.join("\n");
    },
    registrationServicesChanged(data) {
      this.formData.registrationServices = data;
    },
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.put(
            `${this.$dataApi.services.confirmationService}/${this.formData.id}`,
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
              `${this.$dataApi.services.confirmationService}/${this.formData.id}`
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
        loadUrl: `${this.$dataApi.download.confirmationService}/${this.formData.id}`,
        name: `${this.$t("navigation.agency.confirmationServiceTitle")} № ${
          this.formData.index
        }.docx`
      });
    },
    onPrint() {
      if (this.documentEditorData === null) {
        this.$awn.asyncBlock(
          this.$axios.get(
            `${this.$dataApi.getHtml.confirmationService}/${this.formData.id}`
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
    }
  },
  created() {
    if (this.confirmationStatementId != null) {
      this.formData.confirmationStatementId = this.confirmationStatementId;
    }
  }
});
</script>
