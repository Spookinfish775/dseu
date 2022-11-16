<template>
	<div class="card-wrapper">
		<BaseToolbar
			:canSave="canUpdate"
			:canDelete="fullAccess"
			:canDownload="true"
			:canPrint="true"
			:havePayment="true"
			:haveConfirmationService="true"
			:haveUploadFile="true"
			@confirmationService="onConfirmationService"
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
      <DxGroupItem :col-count="10">
        	<DxSimpleItem
					data-field="decision"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="decisionOptions"
				>
					<DxLabel :text="$t('labels.decision')" />
				</DxSimpleItem>
      </DxGroupItem>
			<DxGroupItem :col-count="2">
				 <DxSimpleItem
          data-field="organizationId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="organizationOptions"
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
					data-field="userId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="userOptions"
				>
					<DxLabel :text="$t('labels.executor')" />
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
					:editor-options="dateBoxOptions"
				>
					<DxLabel :text="$t('labels.systemServiceDate')" />
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
			<template #letterSenderOrganizationSelectBox>
				<ApplicantSelectBox
					:value="formData.letterSenderOrganizationId"
					:filter="letterSenderOrganizationFilter"
					@valueChanged="value => (formData.letterSenderOrganizationId = value)"
				/>
			</template>
		</DxForm>
		<DocumentEditorPopup
			v-model="documentEditorVisible"
			:data="documentEditorData"
		/>
		<PaymentPopup ref="paymentPopup" :document="formData" />
		<BasePopup
			:title="$t('labels.confirmationService')"
			width="70vw"
			ref="confirmationServiceBasePopup"
		>
			<ConfirmationServiceCard
				v-if="formData.confirmationServiceId"
				:data="confirmationService"
				:confirmationStatementId="formData.id"
				@successedDeleted="deletedConfirmationService"
			/>
			<ConfirmationServiceCreate
				v-else
				:confirmationStatementId="formData.id"
				@successedSaved="createdConfirmationService"
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
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";
import PaymentPopup from "~/components/agency/statements/components/payment-service/payment-popup.vue";
import ConfirmationServiceCreate from "~/components/agency/services/confirmationService/create.vue";
import ConfirmationServiceCard from "~/components/agency/services/confirmationService/card.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IConfirmationStatement } from "~/infrastructure/interfaces/agency/statements/IConfirmationStatement";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { DecisionStatuses } from "~/infrastructure/data-sources/DecisionStatuses";
import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
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
		ApplicantsList,
		AcceptedDocumentsList,
		OrganizationSelectBox,
		DocumentEditorPopup,
		PaymentPopup,
		BasePopup,
		ConfirmationServiceCreate,
		ConfirmationServiceCard,
		ApplicantSelectBox
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
		let formData: IConfirmationStatement = this.data;

		return {
			formData,
			documentEditorVisible: false,
			documentEditorData: null,
			confirmationService: null
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
    organizationOptions(){
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.organization + "/userOrganizations"
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
		acceptedDocumentsChanged(data) {
			this.formData.acceptedDocuments = data;
		},
		onConfirmationService() {
			if (this.formData.confirmationServiceId) {
				this.$awn.asyncBlock(
					this.$axios.get(
						`${this.$dataApi.services.confirmationService}/${this.formData.confirmationServiceId}`
					),
					e => {
						this.$awn.success();
						this.confirmationService = e.data;
						this.$refs.confirmationServiceBasePopup.open();
					},
					e => {
						this.$awn.alert();
					}
				);
			} else {
				this.$refs.confirmationServiceBasePopup.open();
			}
		},
		deletedConfirmationService() {
			this.$refs.confirmationServiceBasePopup.close();
			this.formData.confirmationServiceId = null;
		},
		createdConfirmationService(data) {
			this.$refs.confirmationServiceBasePopup.close();
			this.formData.confirmationServiceId = data.id;
		},
		onDownload() {
			DocumentLoader.load(this, {
				loadUrl: `${this.$dataApi.download.confirmationStatement}/${this.formData.id}`,
				name: `${this.$t("navigation.agency.confirmationStatementTitle")} № ${
					this.formData.index
				}.docx`
			});
		},
		onPrint() {
			if (this.documentEditorData === null) {
				this.$awn.asyncBlock(
					this.$axios.get(
						`${this.$dataApi.getHtml.confirmationStatement}/${this.formData.id}`
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
						`${this.$dataApi.statements.confirmationStatement}/${this.formData.id}`,
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
							`${this.$dataApi.statements.confirmationStatement}/${this.formData.id}`
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
