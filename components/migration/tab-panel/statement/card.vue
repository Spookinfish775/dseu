<template>
	<div class="card-wrapper">
		<BaseToolbar
			:canSave="canUpdate"
			:canDelete="fullAccess"
			:canDownload="true"
			:canPrint="true"
			:havePayment="true"
			:haveRegistrationService="true"
			:haveRefusalService="true"
			:haveSuspendStatement="true"
			:haveAnalisys="true"
			:haveCreateFrom="true"
			:haveUploadFile="true"
			@save="onSave"
			@delete="onDelete"
			@download="onDownload"
			@print="onPrint"
			@registrationService="onRegistrationService"
			@refusalService="onRefusalService"
			@suspendStatement="onSuspendStatement"
			@analysisProcess="onAnalysisProcess"
			@payment="$refs['paymentPopup'].open()"
			@createFrom="createFrom"
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
				</DxSimpleItem>
				<DxSimpleItem
					data-field="oldRealEstateAddress"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.oldRealEstateAddress')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="lawId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="lawOptions"
				>
					<DxLabel :text="$t('labels.law')" />
				</DxSimpleItem>
				<DxGroupItem :col-count="3">
					<DxSimpleItem
						data-field="lawStartDate"
						editor-type="dxDateBox"
						:editor-options="dateBoxOptions"
					>
						<DxLabel :text="$t('labels.lawStartDate')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="lawPeriod"
						data-type="number"
						editor-type="dxNumberBox"
						:editor-options="lawPeriodOptions"
					>
						<DxLabel :text="$t('labels.lawPeriod')" />
						<DxRequiredRule />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="lawPeriodType"
						data-type="number"
						editor-type="dxSelectBox"
						:editor-options="lawPeriodTypeOptions"
					>
						<DxLabel :text="$t('labels.lawPeriodType')" />
						<DxRequiredRule />
					</DxSimpleItem>
				</DxGroupItem>
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
					data-field="isDeal"
					data-type="boolean"
					editor-type="dxCheckBox"
					:col-span="2"
				>
					<DxLabel :text="$t('labels.isDeal')" location="left" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="enteredStatementDate"
					data-type="datetime"
					editor-type="dxDateBox"
					:editor-options="enteredStatementDateOptions"
				>
					<DxRequiredRule />
					<DxLabel :text="$t('labels.enteredStatementDate')" />
				</DxSimpleItem>

				<DxSimpleItem
					data-field="systemStatementDate"
					data-type="datetime"
					editor-type="dxDateBox"
					:editor-options="systemStatementDateOptions"
				>
					<DxLabel :text="$t('labels.systemDate')" />
				</DxSimpleItem>

				<DxSimpleItem
					data-field="registrationStatementNumber"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="registrationStatementNumberOptions"
				>
					<DxRequiredRule />
					<DxLabel :text="$t('labels.registrationStatementNumber')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="conventionalNumber"
					data-type="string"
					template="conventionalNumberTextBox"
				>
					<DxRequiredRule />
					<DxLabel :text="$t('labels.conventionalNumber')" />
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
					:readOnly="!canUpdate || !fullAccess || readOnly"
					@valueChanged="applicantsListChanged"
					@representativeSaved="representativeSaved"
				/>
			</template>
			<template #acceptedDocumentsList>
				<AcceptedDocumentsList
					:readOnly="!canUpdate || !fullAccess || readOnly"
					:data="formData.acceptedDocuments"
					@valueChanged="acceptedDocumentsChanged"
				/>
			</template>
			<template #realEstateSelectBox>
				<RealEstateSelectBox
					:readOnly="!canUpdate || !fullAccess || readOnly"
					:value="formData.realEstateId"
					@valueChanged="realEstateChanged"
				/>
			</template>
			<template #letterSenderOrganizationSelectBox>
				<ApplicantSelectBox
					:readOnly="!canUpdate || !fullAccess || readOnly"
					:value="formData.letterSenderOrganizationId"
					:filter="letterSenderOrganizationFilter"
					@valueChanged="value => (formData.letterSenderOrganizationId = value)"
				/>
			</template>
			<template #conventionalNumberTextBox>
				<ConventionalNumberTextBox
					:value="formData.conventionalNumber"
					:readOnly="true"
					:disabled="haveConventionalNumber"
					@valueChanged="conventionalNumberChanged"
				/>
			</template>
		</DxForm>
		<DocumentEditorPopup
			v-model="documentEditorVisible"
			:data="documentEditorData"
		/>
		<PaymentPopup ref="paymentPopup" :document="formData" />
		<BasePopup
			ref="analysisProcessPopup"
			position="top"
			width="70vw"
			height="70vh"
			:title="$t('labels.analysisProcess')"
		>
			<AnalysisProcess :data="formData.analysisProcess" />
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
import { alert } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import BasePopup from "~/components/page/popup.vue";
import AnalysisProcess from "~/components/agency/statements/components/analysisProcess/index.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";
import PaymentPopup from "~/components/agency/statements/components/payment-service/payment-popup.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";
import ConventionalNumberTextBox from "~/components/agency/statements/components/conventionalNumber/text-box.vue";

import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IRegistrationStatement } from "~/infrastructure/interfaces/agency/statements/IRegistrationStatement";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { DecisionStatuses } from "~/infrastructure/data-sources/DecisionStatuses";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { StatementType } from "~/infrastructure/enums/StatementType";
import { ApplicantStatements } from "~/infrastructure/classes/ApplicantStatements";
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
		DxAsyncRule,
		DxPatternRule,
		DxButtonItem,
		DxTextArea,
		BaseToolbar,
		BasePopup,
		AnalysisProcess,
		ApplicantsDataGrid,
		ApplicantsList,
		AcceptedDocumentsDataGrid,
		AcceptedDocumentsList,
		RealEstateSelectBox,
		DocumentEditorPopup,
		PaymentPopup,
		ApplicantSelectBox,
		ConventionalNumberTextBox
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
		let formData: IRegistrationStatement = this.data;

		return {
			formData,
			partOfRightPattern: /^[0-9][/][0-9]+$/,
			documentEditorVisible: false,
			documentEditorData: null,
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
		enteredStatementDateOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
				type: "datetime",
				applyValueMode: "useButtons"
			});
		},
		systemStatementDateOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
				type: "datetime",
				readOnly: true
			});
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
		registrationStatementNumberOptions() {
			return new TextBoxProperties({
				readOnly: true
			});
		},
		partOfRightOptions() {
			return new TextBoxProperties({
				readOnly: true
			});
		},
		lawOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.law
			});
		},
		lawPeriodTypeOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: LawPeriodTypes(this),
				disabled: this.formData.lawStartDate === null
			});
		},
		chapterNumberOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: `${this.$dataApi.chapterNumberRegistrationStatement}/${this.formData.realEstateId}`,
				filter: ["isUsed", "=", false],
				readOnly: this.formData.realEstateId === null,
				displayExpr: "number",
				valueExpr: "number",
				key: "number",
				searchExpr: "number"
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
		conventionalNumberChanged(value) {
			this.formData.conventionalNumber = value
				? value
				: this.formData.registrationStatementNumber;
		},
		applicantsChanged(applicants) {
			this.formData.applicants = applicants;
		},
		acceptedDocumentsChanged(acceptedDocuments) {
			this.formData.acceptedDocuments = acceptedDocuments;
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
		onAnalysisProcess() {
			this.$refs.analysisProcessPopup.open();
		},
		onRegistrationService() {
			if (this.formData.registrationServiceId) {
				this.$router.push(
					`/agency/services/registrationService/${this.formData.registrationServiceId}`
				);
			} else {
				this.$router.push({
					path: `/agency/services/registrationService/create`,
					query: { registrationStatement: this.formData.id }
				});
			}
		},
		onRefusalService() {
			if (this.formData.refusalServiceId) {
				this.$router.push(
					`/agency/services/refusalService/${this.formData.refusalServiceId}`
				);
			} else {
				this.$router.push({
					path: `/agency/services/refusalService/create`,
					query: { registrationStatement: this.formData.id }
				});
			}
		},
		onSuspendStatement() {
			if (this.formData.suspendStatementId) {
				this.$router.push(
					`/agency/statements/suspendStatement/${this.formData.suspendStatementId}`
				);
			} else {
				this.$router.push({
					path: `/agency/statements/suspendStatement/create`,
					query: { registrationStatement: this.formData.id }
				});
			}
		},
		onDownload() {
			DocumentLoader.load(this, {
				loadUrl: `${this.$dataApi.download.registrationStatement}/${this.formData.id}`,
				name: `${this.$t("navigation.agency.registrationStatementTitle")} № ${
					this.formData.index
				}.docx`
			});
		},
		onPrint() {
			if (this.documentEditorData === null) {
				this.$awn.asyncBlock(
					this.$axios.get(
						`${this.$dataApi.getHtml.registrationStatement}/${this.formData.id}`
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
			if (this.formData.acceptedDocuments.length === 0) {
				result.isValid = false;
				alert(this.$t("errors.needAcceptedDocuments"), this.$t(`errors.title`));
			}
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.statements.registrationStatement}/${this.formData.id}`,
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
							`${this.$dataApi.statements.registrationStatement}/${this.formData.id}`
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
		},
		createFrom(statementType) {
			this.$router.push(
				`/agency/statements/createFrom?fromStatementType=${StatementType.RegistrationStatement}&statementId=${this.data.id}&createStatementType=${statementType.id}`
			);
		}
	}
});
</script>
