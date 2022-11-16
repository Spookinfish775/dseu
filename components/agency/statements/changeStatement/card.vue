<template>
  <div class="card-wrapper">
    <BaseToolbar
      :canSave="canUpdate"
      :canDelete="fullAccess"
      :canDownload="true"
      :canPrint="true"
      :havePayment="true"
      :haveChangeService="true"
      :haveUploadFile="true"
      @payment="$refs['paymentPopup'].open()"
      @changeService="onChangeService"
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
      <DxGroupItem :col-count="2">
        <DxSimpleItem
          data-field="applicantStatements"
          template="applicantsList"
        >
          <DxLabel :text="$t('labels.applicants')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="acceptedDocuments"
          template="acceptedDocumentsList"
        >
          <DxLabel :text="$t('registrationStatement.acceptedDocuments')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem :col-count="12">
        <DxSimpleItem
          data-field="decision"
          data-type="number"
          editor-type="dxSelectBox"
          :col-span="2"
          :editor-options="decisionOptions"
        >
          <DxLabel :text="$t('labels.decision')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem :col-count="2">
        <DxSimpleItem
          data-field="realEstateId"
          data-type="number"
          template="realEstateSelectBox"
        >
          <DxLabel :text="$t('labels.realEstate')" />
          <DxRequiredRule :message="$t('notifications.required.realEstate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="lawId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="lawOptions"
        >
          <DxLabel :text="$t('labels.law')" />
          <DxRequiredRule :message="$t('notifications.required.law')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="changeDescription"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.changeDescription')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem :col-count="2">
        <DxSimpleItem
          data-field="enteredStatementDate"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="enteredStatementDateOptions"
        >
          <DxLabel :text="$t('labels.enteredStatementDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="systemStatementDate"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="enteredStatementDateOptions"
        >
          <DxLabel :text="$t('labels.systemServiceDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="letterSenderOrganizationId"
          data-type="number"
          template="letterSenderOrganizationSelectBox"
        >
          <DxLabel :text="$t('labels.letterSenderOrganization')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="userId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="userOptions"
        >
          <DxLabel :text="$t('labels.executor')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxSimpleItem
        data-field="changeCondition"
        data-type="string"
        editor-type="dxTextArea"
        :editor-options="textAreaOptions"
      >
        <DxLabel :text="$t('labels.changeCondition')" />
      </DxSimpleItem>
      <DxSimpleItem
        data-field="note"
        data-type="string"
        editor-type="dxTextArea"
        :editor-options="textAreaOptions"
      >
        <DxLabel :text="$t('labels.note')" />
      </DxSimpleItem>
      <template #applicantsList>
        <ApplicantsList
          :data="formData.applicants"
          :applicantStatements="formData.applicantStatements"
          :partOfRights="formData.partOfRights"
          :readOnly="!canUpdate || !fullAccess || readOnly"
          :manipulateWithPartOfRigth="true"
          @valueChanged="applicantsListChanged"
          @representativeSaved="representativeSaved"
        />
      </template>
      <template #acceptedDocumentsList>
        <AcceptedDocumentsList
          :data="formData.acceptedDocuments"
          @valueChanged="acceptedDocumentsChanged"
        />
      </template>
      <template #realEstateSelectBox>
        <RealEstateSelectBox
          :value="formData.realEstateId"
          @valueChanged="realEstateChanged"
        />
      </template>
      <template #letterSenderOrganizationSelectBox>
        <ApplicantSelectBox
          :value="formData.letterSenderOrganizationId"
          :filter="letterSenderOrganizationFilter"
          @valueChanged="
            (value) => (formData.letterSenderOrganizationId = value)
          "
        />
      </template>
    </DxForm>
    <DocumentEditorPopup
      v-model="documentEditorVisible"
      :data="documentEditorData"
    />
    <PaymentPopup ref="paymentPopup" :document="formData" />
    <TypeSelector ref="typeSelector" :types="changeStatementType" />
    <ChangeServiceBasePopup
      ref="changeServiceBasePopup"
      :title="$t('labels.changeService')"
      width="70vw"
    >
      <ChangeServiceCard
        v-if="formData.changeServiceId"
        :data="changeService"
        :changeStatementId="formData.id"
        @successedDeleted="deletedChangeService"
      />
      <ChangeServiceCreate
        v-else
        :changeStatementId="formData.id"
        @successedSaved="createdChangeService"
      />
    </ChangeServiceBasePopup>
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
  DxButtonItem,
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";
import PaymentPopup from "~/components/agency/statements/components/payment-service/payment-popup.vue";
import TypeSelector from "~/components/layout/type-selector/index.vue";
import ChangeServiceBasePopup from "~/components/page/popup.vue";
import ChangeServiceCreate from "~/components/agency/services/changeService/create.vue";
import ChangeServiceCard from "~/components/agency/services/changeService/card.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IChangeStatement } from "~/infrastructure/interfaces/agency/statements/IChangeStatement";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { DecisionStatuses } from "~/infrastructure/data-sources/DecisionStatuses";
import { ChangeStatementTypes } from "~/infrastructure/data-sources/agency/ChangeStatementTypes";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { ApplicantStatements } from "~/infrastructure/classes/ApplicantStatements";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxEmailRule,
    DxAsyncRule,
    DxPatternRule,
    DxButtonItem,
    DxTextArea,
    BaseToolbar,
    ApplicantsDataGrid,
    ApplicantsList,
    AcceptedDocumentsDataGrid,
    AcceptedDocumentsList,
    RealEstateSelectBox,
    DocumentEditorPopup,
    PaymentPopup,
    TypeSelector,
    ChangeServiceBasePopup,
    ChangeServiceCreate,
    ChangeServiceCard,
    ApplicantSelectBox,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let formData: IChangeStatement = this.data;

    return {
      formData,
      documentEditorVisible: false,
      documentType: null,
      changeService: null,
      changeStatementType: ChangeStatementTypes(this),
      documentEditorData: null,
    };
  },
  computed: {
    canCreate() {
      let permission: number =
        this.$store.getters["user/claims"]["ChangeStatement"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number =
        this.$store.getters["user/claims"]["ChangeStatement"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number =
        this.$store.getters["user/claims"]["ChangeStatement"];
      return PermissionControler.fullAccess(permission);
    },
    enteredStatementDateOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
        type: "datetime",
        applyValueMode: "useButtons",
      });
    },
    dateBoxOptions() {
      return new DateBoxProperties({
        readOnly: true,
      });
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    lawOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.law,
      });
    },
    decisionOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: DecisionStatuses(this),
        readOnly: true,
      });
    },
    userOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.user,
        displayExpr: "fullName",
        readOnly: true,
      });
    },
    letterSenderOrganizationFilter() {
      return ["applicantType", "=", ApplicantType.LetterSenderOrganization];
    },
  },
  methods: {
    acceptedDocumentsChanged(acceptedDocuments) {
      this.formData.acceptedDocuments = acceptedDocuments;
    },
    realEstateChanged(data) {
      this.formData.realEstateId = data;
    },
    onChangeService() {
      if (this.formData.changeServiceId) {
        let result = this.$refs["form"].instance.validate();
        if (result.isValid) {
          this.$awn.asyncBlock(
            this.$axios.get(
              `${this.$dataApi.services.changeService}/${this.formData.changeServiceId}`
            ),
            (e) => {
              this.$awn.success();
              this.changeService = e.data;
              this.$refs.changeServiceBasePopup.open();
            },
            (e) => {
              this.$awn.alert();
            }
          );
        }
      } else {
        this.$refs.changeServiceBasePopup.open();
      }
    },
    deletedChangeService() {
      this.$refs.changeServiceBasePopup.close();
      this.formData.changeServiceId = null;
    },
    createdChangeService(data) {
      this.$refs.changeServiceBasePopup.close();
      this.formData.changeServiceId = data.id;
    },
    async onDownload() {
      let result = await this.$refs["typeSelector"].open();
      if (result) {
        DocumentLoader.load(this, {
          loadUrl: `${this.$dataApi.download.changeStatement}?id=${this.formData.id}&ChangeStatementType=${result.id}`,
          name: `${this.$t("navigation.agency.changeStatementTitle")} № ${
            this.formData.index
          }.docx`,
        });
      }
    },
    async onPrint() {
      let result = await this.$refs["typeSelector"].open();
      if (result) {
        this.$awn.asyncBlock(
          this.$axios.get(`${this.$dataApi.getHtml.changeStatement}`, {
            params: {
              id: this.formData.id,
              ChangeStatementType: result.id,
            },
          }),
          (e) => {
            this.$awn.success();
            this.documentEditorData = e.data;
            this.documentEditorVisible = true;
          },
          (e) => {
            this.$awn.alert();
          }
        );
      }
    },
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.put(
            `${this.$dataApi.statements.changeStatement}/${this.formData.id}`,
            this.formData
          ),
          (e) => {
            this.$awn.success();
            this.documentEditorData = null;
            this.$emit("successedSaved", e.data);
          },
          (e) => {
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
      result.then((dialogResult) => {
        if (dialogResult) {
          this.$awn.asyncBlock(
            this.$axios.delete(
              `${this.$dataApi.statements.changeStatement}/${this.formData.id}`
            ),
            (e) => {
              this.$awn.success();
              this.$emit("successedDeleted");
            },
            (e) => {
              this.$awn.alert();
            }
          );
        }
      });
    },
    representativeSaved(val) {
      const { id } = val.currentApplicant;

      this.formData.applicantStatements.forEach((element) => {
        if (element.applicantId === id) {
          element.statementApplicantStatus = val.representativeType;
          element.representativeDocuments = val.representativeDocuments;
        }
      });
    },
    applicantsListChanged(applicants) {
      if (applicants.length > this.formData.applicantStatements.length) {
        applicants.forEach((applicant, index) => {
          const result = this.formData.applicantStatements.some(
            (applicantStatement) =>
              applicant.id === applicantStatement.applicantId
          );
          if (!result) {
            this.formData.applicantStatements.push(new ApplicantStatements());
            this.formData.applicantStatements[index].applicantId = applicant.id;
          }
        });
      }
      if (applicants.length === 0) {
        this.formData.applicantStatements.splice(0, 1);
      }

      // this.formData.applicantStatements.push(new ApplicantStatements)
    },
  },
});
</script>