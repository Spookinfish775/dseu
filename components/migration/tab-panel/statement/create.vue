<template>
  <div class="card-wrapper">
    <BaseToolbar :canSave="canCreate" @save="onSave" />
    <DxForm ref="form" label-location="top" :form-data.sync="formData">
      <!-- <DxGroupItem>
        <DxSimpleItem
          data-field="acceptedDocuments"
          template="acceptedDocumentsList"
        >
          <DxLabel :text="$t('registrationStatement.acceptedDocuments')" />
        </DxSimpleItem>
      </DxGroupItem> -->
      <DxGroupItem :col-count="3">
        <DxSimpleItem
          data-field="blankNumber"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + data.blankNumber"
        >
          <DxLabel :text="$t('migration.dataGrid.blankNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="branchNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + data.branchNumber"
        >
          <DxLabel :text="$t('migration.dataGrid.branchNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="registeredDate"
          editor-type="dxDateBox"
          :editor-options="dateBoxOptions"
          :help-text="'Gelen maglumat : ' + data.registeredDate"
        >
          <DxLabel :text="$t('migration.dataGrid.registeredDate')" />
        </DxSimpleItem>
        <!-- <DxSimpleItem
          data-field="elektronTb"
          data-type="number"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + data.elektronTb"
        >
        </DxSimpleItem> -->
        <DxSimpleItem
          data-field="executionTime"
          editor-type="dxDateBox"
          :editor-options="dateBoxOptions"
          :help-text="'Gelen maglumat : ' + data.executionTime"
        >
          <DxRequiredRule />
          <DxLabel :text="$t('migration.dataGrid.executionTime')" />
        </DxSimpleItem>
        <!-- <DxSimpleItem
          data-field="officialDocumentsFullInformation"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
        </DxSimpleItem> -->
        <!-- <DxSimpleItem
          data-field="organizationId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="organizationIdOptions"
        >
        </DxSimpleItem> -->
        <DxSimpleItem
          data-field="partOfRight"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + data.partOfRight"
        >
          <DxLabel :text="$t('migration.dataGrid.partOfRight')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="receiptNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + data.receiptNumber"
        >
          <DxLabel :text="$t('migration.dataGrid.receiptNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="receiptSum"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberOptions"
          :help-text="'Gelen maglumat : ' + data.receiptSum"
        >
          <DxLabel :text="$t('migration.dataGrid.receiptSum')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="registrationServiceIndex"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberOptions"
          :help-text="'Gelen maglumat : ' + data.registrationServiceIndex"
        >
          <DxLabel :text="$t('migration.dataGrid.registrationServiceIndex')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="registrationStatementIndex"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberOptions"
          :help-text="'Gelen maglumat : ' + data.registrationStatementIndex"
        >
          <DxLabel
            :text="$t('migration.dataGrid.registrationStatementIndex')"
          />
        </DxSimpleItem>
        <!-- <DxSimpleItem
          data-field="tb"
          data-type="number"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
        </DxSimpleItem> -->
        <DxSimpleItem
          data-field="technicalReceiptNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + data.technicalReceiptNumber"
        >
          <DxLabel :text="$t('migration.dataGrid.technicalReceiptNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="technicalReceiptSum"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberOptions"
          :help-text="'Gelen maglumat : ' + data.technicalReceiptSum"
        >
          <DxLabel :text="$t('migration.dataGrid.technicalReceiptSum')" />
        </DxSimpleItem>
        <!-- <DxSimpleItem
          data-field="address"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.address')" />
        </DxSimpleItem> -->
        <DxSimpleItem
          data-field="lawId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="lawOptions"
          :help-text="'Gelen maglumat : ' + data.lawName"
        >
          <DxLabel :text="$t('migration.dataGrid.law')" />
          <DxRequiredRule :message="$t('notifications.required.law')" />
        </DxSimpleItem>
        <DxGroupItem :col-count="3"> </DxGroupItem>
        <DxSimpleItem
          data-field="isDeal"
          data-type="boolean"
          editor-type="dxCheckBox"
        >
          <DxLabel :text="$t('labels.isDeal')" location="left" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxSimpleItem
        data-field="note"
        data-type="string"
        editor-type="dxTextArea"
        :editor-options="textAreaOptions"
      >
        <DxLabel :text="$t('migration.dataGrid.note')" />
      </DxSimpleItem>
      <template #acceptedDocumentsList>
        <AcceptedDocumentsList
          :data="formData.acceptedDocuments"
          @valueChanged="acceptedDocumentsChanged"
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
import { alert } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { RegistrationStatement } from "~/infrastructure/classes/agency/statements/RegistrationStatement";
import { IRegistrationStatement } from "~/infrastructure/interfaces/agency/statements/IRegistrationStatement";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { ApplicantStatements } from "~/infrastructure/classes/ApplicantStatements";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { BookType } from "~/infrastructure/enums/BookType";
import { LawPeriodTypes } from "~/infrastructure/data-sources/LawPeriodTypes";

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
    AcceptedDocumentsDataGrid,
    AcceptedDocumentsList,
    ApplicantSelectBox
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    // let formData: IRegistrationStatement = new RegistrationStatement(this.data);

    return {
      formData: this.data,
      partOfRightPattern: /^[0-9][/][0-9]+$/,
      haveConventionalNumber: false
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "RegistrationStatement"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "RegistrationStatement"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "RegistrationStatement"
      ];
      return PermissionControler.fullAccess(permission);
    },
    numberOptions() {
      return new NumberBoxProperties();
    },
    dateBoxOptions() {
      return new DateBoxProperties();
    },
    lawPeriodOptions() {
      return new NumberBoxProperties({
        disabled: this.formData.lawStartDate === null
      });
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    partOfRightOptions() {
      return new TextBoxProperties({
        readOnly: true
      });
    },
    lawPeriodTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: LawPeriodTypes(this),
        disabled: this.formData.lawStartDate === null
      });
    },
    lawOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.law
      });
    },
    registrationStatementNumberOptions() {
      return new TextBoxProperties({
        readOnly: true
      });
    },
    chapterNumberOptions() {
      this.$dataApi.chapterNumberRegistrationStatement;
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: `${this.$dataApi.chapterNumberRegistrationStatement}/${this.formData.realEstateId}`,
        filter: ["isUsed", "=", false],
        readOnly: this.formData.realEstateId == null,
        displayExpr: "number",
        valueExpr: "number",
        key: "number",
        searchExpr: "number"
      });
    },
    letterSenderOrganizationFilter() {
      return ["applicantType", "=", ApplicantType.LetterSenderOrganization];
    },
    letterSenderOrganizationId() {
      return this.formData.letterSenderOrganizationId;
    },
    realEstateId() {
      return this.formData.realEstateId;
    },
    index() {
      return this.formData.index;
    },
    enteredStatementDate() {
      return this.formData.enteredStatementDate;
    }
  },
  watch: {
    realEstateId(val) {
      this.getRegistrationStatementNumber();
    },
    index(val) {
      this.getRegistrationStatementNumber();
    },
    enteredStatementDate(val) {
      this.getRegistrationStatementNumber();
    }
  },
  methods: {
    async getRegistrationStatementNumber() {
      if (this.realEstateId && this.index && this.enteredStatementDate) {
        const { data } = await this.$axios.get(
          this.$dataApi.getRegistrationNumber,
          {
            params: {
              BookType: BookType.RegistrationStatementBook,
              RealEstateId: this.realEstateId,
              Index: this.index,
              EnteredRegistrationDate: this.enteredStatementDate
            }
          }
        );
        this.formData.registrationStatementNumber = data;
        if (!this.formData.conventionalNumber && !this.haveConventionalNumber)
          this.formData.conventionalNumber = data;
      }
    },
    acceptedDocumentsChanged(data) {
      this.formData.acceptedDocuments = data;
    },
    letterSenderOrganizationChanged(data) {
      this.formData.letterSenderOrganizationId = data;
    },
    async realEstateChanged(data) {
      if (data) {
        const { data: realEstate } = await this.$axios.get(
          `${this.$dataApi.realEstate}/${data}`
        );
        this.formData.conventionalNumber = realEstate.conventionalNumber;
        if (realEstate.conventionalNumber) {
          this.haveConventionalNumber = true;
        } else {
          this.haveConventionalNumber = false;
        }
      }
      this.formData.realEstateId = data;
    },
    conventionalNumberChanged(value) {
      this.formData.conventionalNumber = value
        ? value
        : this.formData.registrationStatementNumber;
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
    onSave() {
      let result = this.$refs["form"].instance.validate();
      // if (this.formData.acceptedDocuments.length === 0) {
      //   result.isValid = false;
      //   alert(this.$t("errors.needAcceptedDocuments"), this.$t(`errors.title`));
      // }
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(this.$dataApi.dataMigration.index, this.formData),
          e => {
            console.log(e.data);

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
