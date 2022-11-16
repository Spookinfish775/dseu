<template>
  <div>
    <BaseToolbar :canSave="true" @save="saveApplicant" />

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
          >
            <DxLabel :text="$t('labels.firstName')" />
            <DxRequiredRule :message="$t('notifications.required.firstName')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="lastName"
            data-type="string"
            editor-type="dxTextBox"
            :editor-options="textBoxOptions"
          >
            <DxLabel :text="$t('labels.lastName')" />
            <DxRequiredRule :message="$t('notifications.required.lastName')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="middleName"
            data-type="string"
            editor-type="dxTextBox"
            :editor-options="textBoxOptions"
          >
            <DxLabel :text="$t('labels.middleName')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="citizenshipId"
            data-type="number"
            editor-type="dxSelectBox"
            :editor-options="citizenshipOptions"
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
          >
            <DxLabel :text="$t('labels.dateOfBirth')" />
            <DxRequiredRule />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="placeOfBirth"
            data-type="string"
            editor-type="dxTextBox"
            :editor-options="textBoxOptions"
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
        >
          <DxLabel :text="$t('labels.registration')" />
          <DxRequiredRule
            :message="$t('notifications.required.registration')"
          />
        </DxSimpleItem>
        <DxGroupItem>
          <DxSimpleItem
            data-field="isRepresentative"
            data-type="boolean"
            editor-type="dxCheckBox"
          >
            <DxLabel location="left" :text="$t('labels.isRepresentative')" />
          </DxSimpleItem>
          <DxSimpleItem
            :visible="applicant.isRepresentative"
            data-field="representativeDocuments"
            template="representativeDocumentsDataGrid"
          >
            <DxLabel
              location="top"
              :text="$t('labels.representativeDocuments')"
            />
          </DxSimpleItem>
        </DxGroupItem>
      </DxGroupItem>
      <DxGroupItem
        :visible="applicant.applicantType === ApplicantType.LegalEntity"
        :caption="$t('labels.info')"
      >
        <DxSimpleItem
          data-field="name"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.name')" />
          <DxRequiredRule :message="$t('notifications.required.name')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="tin"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.tin')" />
          <DxRequiredRule :message="$t('notifications.required.tin')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="address"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.address')" />
          <DxRequiredRule :message="$t('notifications.required.address')" />
        </DxSimpleItem>
        <DxGroupItem>
          <DxSimpleItem
            data-field="isRepresentative"
            data-type="boolean"
            editor-type="dxCheckBox"
          >
            <DxLabel location="left" :text="$t('labels.isRepresentative')" />
          </DxSimpleItem>
          <DxSimpleItem
            :visible="applicant.isRepresentative"
            data-field="representativeDocuments"
            template="representativeDocumentsDataGrid"
          >
            <DxLabel
              location="top"
              :text="$t('labels.representativeDocuments')"
            />
          </DxSimpleItem>
        </DxGroupItem>
      </DxGroupItem>
      <DxGroupItem :col-count="2" :caption="$t('labels.identityDocument')">
        <DxGroupItem :col-count="4" :col-span="2">
          <DxSimpleItem
            data-field="identityDocument.identityDocumentTypeId"
            data-type="number"
            editor-type="dxSelectBox"
            :col-span="2"
            :editor-options="identityDocumentTypeOptions"
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
        >
          <DxLabel :text="$t('labels.issueDate')" />
          <DxRequiredRule :message="$t('notifications.required.issueDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="identityDocument.issuedBy"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.issuedBy')" />
          <DxRequiredRule :message="$t('notifications.required.issuedBy')" />
        </DxSimpleItem>
      </DxGroupItem>

      <template #representativeDocumentsDataGrid>
        <RepresentativeDocumentsDataGrid
          @valueChanged="representativeDocumentsChanged"
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
  DxRequiredRule
} from "devextreme-vue/form";

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
    DxRequiredRule
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    let applicant: IApplicant = new Applicant(this.data);
    return {
      applicant,
      ApplicantType
    };
  },
  computed: {
    citizenshipOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.citizenship
      });
    },
    identityDocumentTypeOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.identityDocumentType
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
          this.applicant.applicantType = e?.value;
          this.applicant.firstName = "";
          this.applicant.lastName = "";
          this.applicant.middleName = "";
          this.applicant.placeOfBirth = "";
          this.applicant.registration = "";
          this.applicant.tin = "";
          this.applicant.name = "";
          this.applicant.isRepresentative = false;
          this.applicant.birthday = null;
          this.applicant.citizenshipId = null;
        }
      });
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    dateBoxOptions() {
      return new DateBoxProperties();
    }
  },
  methods: {
    representativeDocumentsChanged(data) {
      this.applicant.representativeDocuments = data;
    },
    saveApplicant() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(this.$dataApi.applicant, this.applicant),
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
