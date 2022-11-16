<template>
  <div>
    <DxForm ref="form" label-location="top" :form-data.sync="applicant">
      <DxSimpleItem
        data-field="applicantType"
        data-type="number"
        editor-type="dxSelectBox"
        :editor-options="applicantTypeOptions"
      >
        <DxLabel :text="$t('labels.applicantType')" />
        <DxRequiredRule :message="$t('notifications.required.applicantType')" />
      </DxSimpleItem>
      <DxGroupItem
        :visible="applicant.applicantType === ApplicantType.Individual"
        :caption="$t('labels.info')"
      >
        <DxGroupItem :col-count="2">
          <DxSimpleItem
            data-field="firstName"
            data-type="string"
            editor-type="dxTextBox"
            :editor-options="textBoxOptions"
            :help-text="'Gelen maglumat : ' + applicantData.firstName"
          >
            <DxLabel :text="$t('labels.firstName')" />

            <DxRequiredRule :message="$t('notifications.required.firstName')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="lastName"
            data-type="string"
            editor-type="dxTextBox"
            :editor-options="textBoxOptions"
            :help-text="'Gelen maglumat : ' + applicantData.lastName"
          >
            <DxLabel :text="$t('labels.lastName')" />
            <DxRequiredRule :message="$t('notifications.required.lastName')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="middleName"
            data-type="string"
            editor-type="dxTextBox"
            :editor-options="textBoxOptions"
            :help-text="'Gelen maglumat : ' + applicantData.middleName"
          >
            <DxLabel :text="$t('labels.middleName')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="citizenshipId"
            data-type="number"
            editor-type="dxSelectBox"
            :editor-options="citizenshipOptions"
            :help-text="'Gelen maglumat : ' + applicantData.citizenshipName"
          >
            <DxLabel :text="$t('labels.citizenship')" />
            <DxRequiredRule
              :message="$t('notifications.required.citizenship')"
            />
          </DxSimpleItem>
        </DxGroupItem>
        <DxGroupItem :col-count="2">
          <DxSimpleItem
            data-field="birthday"
            data-type="date"
            editor-type="dxDateBox"
            :editor-options="dateBoxOptions"
            :help-text="'Gelen maglumat : ' + applicantData.birthday"
          >
            <DxLabel :text="$t('labels.dateOfBirth')" />
            <DxRequiredRule />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="placeOfBirth"
            data-type="string"
            editor-type="dxTextBox"
            :editor-options="textBoxOptions"
            :help-text="'Gelen maglumat : ' + applicantData.placeOfBirth"
          >
            <DxLabel :text="$t('labels.placeOfBirth')" />
            <DxRequiredRule
              :message="$t('notifications.required.placeOfBirth')"
            />
          </DxSimpleItem>
        </DxGroupItem>
        <DxSimpleItem
          data-field="registration"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + applicantData.registration"
        >
          <DxLabel :text="$t('labels.registration')" />
          <DxRequiredRule
            :message="$t('notifications.required.registration')"
          />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem
        :visible="applicant.applicantType === ApplicantType.LegalEntity"
        :col-count="1"
        :caption="$t('labels.legalEntityApplicant')"
      >
        <DxSimpleItem
          data-field="firstName"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="
            'Gelen maglumat : ' +
              applicantData.firstName +
              applicantData.lastName +
              applicantData.middleName
          "
        >
          <DxLabel :text="$t('labels.firstName')" />

          <DxRequiredRule :message="$t('notifications.required.firstName')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="identityDocument.number"
          data-type="string"
          editor-type="dxTextBox"
          :col-span="1"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + identityDocumentNumber[1]"
        >
          <DxLabel :text="$t('labels.number')" />
          <DxRequiredRule :message="$t('notifications.required.number')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="registration"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + applicantData.registration"
        >
          <DxLabel :text="$t('labels.registration')" />
          <DxRequiredRule
            :message="$t('notifications.required.registration')"
          />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem :col-count="2" :caption="$t('labels.identityDocument')">
        <DxGroupItem :col-count="4" :col-span="2">
          <DxSimpleItem
            data-field="identityDocument.identityDocumentTypeId"
            data-type="string"
            editor-type="dxSelectBox"
            :col-span="2"
            :editor-options="identityDocumentTypeOptions"
            :help-text="
              'Gelen maglumat : ' + applicantData.identityDocumentTypeName
            "
          >
            <DxLabel :text="$t('labels.identityDocumentType')" />
            <DxRequiredRule
              :message="$t('notifications.required.identityDocumentType')"
            />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="identityDocument.series"
            data-type="string"
            editor-type="dxSelectBox"
            :col-span="1"
            :editor-options="seriesOptions"
            :help-text="'Gelen maglumat : ' + identityDocumentNumber[0]"
          >
            <DxLabel :text="$t('labels.series')" />
            <DxRequiredRule />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="identityDocument.number"
            data-type="string"
            editor-type="dxTextBox"
            :col-span="1"
            :editor-options="textBoxOptions"
            :help-text="'Gelen maglumat : ' + identityDocumentNumber[1]"
          >
            <DxLabel :text="$t('labels.number')" />
            <DxRequiredRule :message="$t('notifications.required.number')" />
          </DxSimpleItem>
        </DxGroupItem>
        <DxSimpleItem
          data-field="identityDocument.issueDate"
          data-type="date"
          editor-type="dxDateBox"
          :editor-options="dateBoxOptions"
          :help-text="
            'Gelen maglumat : ' + applicantData.identityDocumentIssueDate
          "
        >
          <DxLabel :text="$t('labels.issueDate')" />
          <DxRequiredRule :message="$t('notifications.required.issueDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="identityDocument.issuedBy"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="
            'Gelen maglumat : ' + applicantData.identityDocumentIssuedBy
          "
        >
          <DxLabel :text="$t('labels.issuedBy')" />
          <DxRequiredRule :message="$t('notifications.required.issuedBy')" />
        </DxSimpleItem>
      </DxGroupItem>

      <DxButtonItem
        :button-options="saveButtonOptions"
        horizontal-alignment="right"
      />
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
import moment from "moment";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RepresentativeDocumentsDataGrid from "~/components/agency/statements/components/applicants/representativeDocuments/data-grid.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { ApplicantTypes } from "~/infrastructure/data-sources/ApplicantTypes";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { Applicant } from "~/infrastructure/classes/Applicant";
import { IApplicant } from "~/infrastructure/interfaces/IApplicant";

export default Vue.extend({
  components: {
    BaseToolbar,
    RepresentativeDocumentsDataGrid,
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem
  },
  props: {
    applicantData: {
      type: Object,
      required: true
    },
    uploadedStateRegisterId: {
      type: Number,
      required: true
    }
  },
  data() {
    let applicant: IApplicant = new Applicant(this.applicantData);

    return {
      applicant,
      ApplicantType,
      identityDocumentNumber: this.applicantData.identityDocumentNumber.split(
        " ",
        2
      )
    };
  },
  computed: {
    citizenshipOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.citizenship,
        displayExpr: "name",
        valueExpr: "id"
      });
    },
    identityDocumentTypeOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.identityDocumentType,
        displayExpr: "name",
        valueExpr: "id"
      });
    },
    seriesOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.IdentityDocumentSeries,
        key: "name",
        valueExpr: "name",
        displayExpr: "name"
      });
    },
    applicantTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: ApplicantTypes(this).filter(
          el => el.id != ApplicantType.LetterSenderOrganization
        ),
        showClearButton: false,
        onValueChanged: e => {
          this.applicantData.applicantType = e?.value;
        }
      });
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    dateBoxOptions() {
      return new DateBoxProperties();
    },
    saveButtonOptions() {
      return {
        text: this.$t("buttons.download"),
        onClick: () => {
          this.onSave();
        }
      };
    }
  },
  methods: {
    async onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(this.$dataApi.dataMigration.applicant, {
            uploadedStateRegisterId: this.uploadedStateRegisterId,
            ...this.applicant
          }),
          e => {
            console.log(e);

            this.$awn.success();
            this.$emit("successedSaved", e.data);
          },
          e => {
            this.$awn.alert();
          }
        );
      }
    },
    representativeDocumentsChanged(data) {
      this.applicant.representativeDocuments = data;
    },
    formateDate(date) {
      let time = null;
      let timestamp = Date.parse(date);

      if (isNaN(timestamp) === false) {
        time = new Date(timestamp);
      }

      return time;
    },
    modifyApplicant() {
      this.applicant.firstName = this.applicantData.firstName;
      this.applicant.lastName = this.applicantData.lastName;
      this.applicant.middleName = this.applicantData.middleName;

      this.applicant.birthday = this.formateDate(this.applicantData.birthday);
      this.applicant.identityDocument.issueDate = this.formateDate(
        this.applicantData.identityDocumentIssueDate
      );
      this.applicant.identityDocument.number = this.identityDocumentNumber[1];
      this.applicant.identityDocument.issuedBy = this.applicantData.identityDocumentIssuedBy;
    }
  },
  created() {
    this.modifyApplicant();
  }
});
</script>
