<template>
  <div class="card-wrapper">
    <BaseToolbar :canSave="canCreate" @save="onSave" />
    <DxForm ref="form" label-location="top" :form-data.sync="formData">
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
      <DxGroupItem :col-count="2">
        <DxSimpleItem
          data-field="extractIndex"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.statementIndex')" />
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
          data-field="requestInformation"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="requestInformationOptions"
        >
          <DxLabel :text="$t('labels.requestInformation')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="registrationServiceId"
          data-type="number"
          template="registrationServiceSelectBox"
        >
          <DxLabel :text="$t('labels.registrationService')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="requestedDocument"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.requestedDocument')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="enteredStatementDate"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="enteredStatementDateOptions"
        >
          <DxLabel :text="$t('labels.enteredStatementDate')" />
          <DxRequiredRule :message="$t('notifications.required.date')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="letterSenderOrganizationId"
          data-type="number"
          template="letterSenderOrganizationSelectBox"
        >
          <DxLabel :text="$t('labels.letterSenderOrganization')" />
        </DxSimpleItem>
      </DxGroupItem>
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
          @valueChanged="value => (formData.letterSenderOrganizationId = value)"
        />
      </template>
      <template #registrationServiceSelectBox>
        <RegistrationServiceSelectBox
          :value="formData.registrationServiceId"
          :displayCase="true"
          :readOnly="
            formData.requestInformation != RequestInformation.DuplicateBlank
          "
          :filter="['realEstateId', '=', formData.realEstateId]"
          @valueChanged="value => (formData.registrationServiceId = value)"
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

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";
import RegistrationServiceSelectBox from "~/components/agency/services/registrationService/select-box/index.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { GiveInformationStatement } from "~/infrastructure/classes/agency/statements/GiveInformationStatement";
import { IGiveInformationStatement } from "~/infrastructure/interfaces/agency/statements/IGiveInformationStatement";
import { RequestInformation } from "~/infrastructure/enums/agency/RequestInformation";
import { RequestInformations } from "~/infrastructure/data-sources/agency/RequestInformations";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { ApplicantStatements } from "~/infrastructure/classes/ApplicantStatements";
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
    ApplicantsDataGrid,
    ApplicantsList,
    AcceptedDocumentsDataGrid,
    AcceptedDocumentsList,
    RealEstateSelectBox,
    ApplicantSelectBox,
    RegistrationServiceSelectBox
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let formData: IGiveInformationStatement = new GiveInformationStatement(
      this.data
    );

    return {
      formData,
      RequestInformation,
      documentEditorData: null,
      documentEditorVisible: false
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "GiveInformationStatement"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "GiveInformationStatement"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "GiveInformationStatement"
      ];
      return PermissionControler.fullAccess(permission);
    },
    enteredStatementDateOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
        type: "datetime",
        applyValueMode: "useButtons"
      });
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    requestInformationOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: RequestInformations(this),
        onValueChanged: e => {
          this.formData.registrationServiceId = null;
        }
      });
    },
    letterSenderOrganizationFilter() {
      return ["applicantType", "=", ApplicantType.LetterSenderOrganization];
    }
  },
  methods: {
    acceptedDocumentsChanged(data) {
      this.formData.acceptedDocuments = data;
    },
    realEstateChanged(data) {
      this.formData.realEstateId = data;
    },
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(
            this.$dataApi.statements.giveInformationStatement,
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
    representativeSaved(val) {
      const { id } = val.currentApplicant;
      this.formData.applicantStatements.forEach(element => {
        if (element.applicantId === id) {
          element.statementApplicantStatus = val.representativeType;
          element.representativeDocuments = val.representativeDocuments;
        }
      });
    },
    applicantsListChanged(val) {
      if (val.length > this.formData.applicantStatements.length) {
        val.forEach((applicant, index) => {
          const result = this.formData.applicantStatements.some(
            applicantStatement =>
              applicant.id === applicantStatement.applicantId
          );
          if (!result) {
            this.formData.applicantStatements.push(new ApplicantStatements());
            this.formData.applicantStatements[index].applicantId = applicant.id;
          }
        });
      }
      if (val.length === 0) {
        this.formData.applicantStatements.splice(0, 1);
      }
    }
  }
});
</script>
