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
          data-field="organizationId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="organizationSelectBox"
        >
          <DxLabel :text="$t('labels.organization')" />
          <DxRequiredRule
            :message="$t('notifications.required.organization')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="confirmationStatementIndex"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.statementIndex')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="territory"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.territory')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="enteredStatementDate"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="enteredStatementDateOptions"
        >
          <DxLabel :text="$t('labels.enteredStatementDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="familyMembers"
          data-type="string"
          editor-type="dxTextArea"
          :editor-options="textAreaOptions"
        >
          <DxLabel :text="$t('labels.familyMembers')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="note"
          data-type="string"
          editor-type="dxTextArea"
          :editor-options="textAreaOptions"
        >
          <DxLabel :text="$t('labels.note')" />
        </DxSimpleItem>

        <DxSimpleItem
          data-field="letterSenderOrganizationId"
          data-type="number"
          template="letterSenderOrganizationSelectBox"
        >
          <DxLabel :text="$t('labels.letterSenderOrganization')" />
        </DxSimpleItem>
      </DxGroupItem>

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
  DxEmailRule,
  DxAsyncRule,
  DxPatternRule,
  DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { ConfirmationStatement } from "~/infrastructure/classes/agency/statements/ConfirmationStatement";
import { IConfirmationStatement } from "~/infrastructure/interfaces/agency/statements/IConfirmationStatement";
import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
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
    ApplicantsList,
    AcceptedDocumentsList,
    OrganizationSelectBox,
    ApplicantSelectBox
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let formData: IConfirmationStatement = new ConfirmationStatement(this.data);

    return {
      formData
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "ConfirmationStatement"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "ConfirmationStatement"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "ConfirmationStatement"
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
    lawOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.law
      });
    },
    realEstateTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: RealEstateTypes(this)
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
    }
  },
  methods: {
    acceptedDocumentsChanged(data) {
      this.formData.acceptedDocuments = data;
    },
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(
            this.$dataApi.statements.confirmationStatement,
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
      // this.formData.applicantStatements.push(new ApplicantStatements)
    }
  }
});
</script>
