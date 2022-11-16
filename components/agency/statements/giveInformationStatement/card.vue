<template>
	<div class="card-wrapper">
		<BaseToolbar
			:canSave="canUpdate"
			:canDelete="fullAccess"
			:canDownload="true"
			:canPrint="true"
			:havePayment="true"
			:haveGiveInformationService="true"
			:haveUploadFile="true"
			@giveInformationService="onGiveInformationService"
			@payment="$refs['paymentPopup'].open()"
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
      <DxGroupItem :col-count="2">
        	<DxSimpleItem
					data-field="decision"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="decisionOptions"
				>
					<DxLabel :text="$t('labels.decision')" />
				</DxSimpleItem>
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
          data-field="userId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="userOptions"
        >
          <DxLabel :text="$t('labels.executor')" />
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
          @valueChanged="data => (formData.realEstateId = data)"
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
    <PaymentPopup ref="paymentPopup" :document="formData" />
    <BasePopup
      ref="giveInformationService"
      :title="$t('navigation.agency.giveInformationServiceTitle')"
      width="70vw"
    >
      <GiveInformationServiceCard
        v-if="formData.giveInformationServiceId != null"
        :data="currentGiveInformationService"
        :giveInformationStatementId="formData.id"
        @successedDeleted="successedDeletedGiveInformationService"
      />
      <GiveInformationServiceCreate
        v-else
        :giveInformationStatementId="formData.id"
        @successedSaved="successedSavedGiveInformationService"
      />
    </BasePopup>
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
import BasePopup from "~/components/page/popup.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";
import PaymentPopup from "~/components/agency/statements/components/payment-service/payment-popup.vue";
import GiveInformationServiceCard from "~/components/agency/services/giveInformationService/card.vue";
import GiveInformationServiceCreate from "~/components/agency/services/giveInformationService/create.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";
import RegistrationServiceSelectBox from "~/components/agency/services/registrationService/select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { IChangeStatement } from "~/infrastructure/interfaces/agency/statements/IChangeStatement";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { RequestInformation } from "~/infrastructure/enums/agency/RequestInformation";
import { RequestInformations } from "~/infrastructure/data-sources/agency/RequestInformations";
import { DecisionStatuses } from "~/infrastructure/data-sources/DecisionStatuses";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
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
    BasePopup,
    GiveInformationServiceCard,
    GiveInformationServiceCreate,
    ApplicantSelectBox,
    RegistrationServiceSelectBox
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
    let formData: IChangeStatement = this.data;

    return {
      formData,
      RequestInformation,
      currentGiveInformationService: null,
      documentEditorVisible: false,
      documentEditorData: null
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
        applyValueMode: "useButtons",
        readOnly: true
      });
    },
    dateBoxOptions() {
      return new DateBoxProperties({
        readOnly: true
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
    decisionOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: DecisionStatuses(this),
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
    letterSenderOrganizationFilter() {
      return ["applicantType", "=", ApplicantType.LetterSenderOrganization];
    }
  },
  methods: {
    acceptedDocumentsChanged(acceptedDocuments) {
      this.formData.acceptedDocuments = acceptedDocuments;
    },
    successedSavedGiveInformationService(data) {
      this.formData.giveInformationServiceId = data.id;
      this.$refs.giveInformationService.close();
    },
    successedDeletedGiveInformationService() {
      this.formData.giveInformationServiceId = null;
      this.$refs.giveInformationService.close();
    },
    onGiveInformationService() {
      if (this.formData.giveInformationServiceId != null) {
        this.$awn.asyncBlock(
          this.$axios.get(
            `${this.$dataApi.services.giveInformationService}/${this.formData.giveInformationServiceId}`
          ),
          e => {
            this.$awn.success();
            this.currentGiveInformationService = e.data;
            this.$refs.giveInformationService.open();
          },
          e => {
            this.$awn.alert();
          }
        );
      } else {
        this.$refs.giveInformationService.open();
      }
    },
    onDownload() {
      DocumentLoader.load(this, {
        loadUrl: `${this.$dataApi.download.giveInformationStatement}/${this.formData.id}`,
        name: `${this.$t(
          "navigation.agency.giveInformationStatementTitle"
        )} № ${this.formData.index}.docx`
      });
    },
    onPrint() {
      if (this.documentEditorData === null) {
        this.$awn.asyncBlock(
          this.$axios.get(
            `${this.$dataApi.getHtml.giveInformationStatement}/${this.formData.id}`
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
            `${this.$dataApi.statements.giveInformationStatement}/${this.formData.id}`,
            this.formData
          ),
          e => {
            this.$awn.success();
            this.documentEditorData = null;
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
              `${this.$dataApi.statements.giveInformationStatement}/${this.formData.id}`
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
    representativeSaved(val) {
      const { id } = val.currentApplicant;

      this.formData.applicantStatements.forEach(element => {
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
            applicantStatement =>
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
    }
  }
});
</script>
