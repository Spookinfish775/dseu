<template>
	<div class="card-wrapper">
		<BaseToolbar
			:canSave="canUpdate"
			:canDelete="fullAccess"
			:canDownload="true"
			:canPrint="true"
			:havePayment="true"
			:haveSuspendService="true"
			:haveUploadFile="true"
			@save="onSave"
			@delete="onDelete"
			@download="onDownload"
			@print="onPrint"
			@payment="$refs['paymentPopup'].open()"
			@suspendService="onSuspendService"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="formData"
			:read-only="readOnly"
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
					data-field="letterSenderOrganizationId"
					data-type="number"
					template="letterSenderOrganizationSelectBox"
				>
					<DxLabel :text="$t('labels.letterSenderOrganization')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="registrationStatementId"
					data-type="number"
					template="statementSelectBox"
				>
					<DxLabel :text="$t('labels.registrationStatement')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="lawId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="lawOptions"
				>
					<DxLabel :text="$t('labels.law')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="dateTime"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="dateBoxOptions"
				>
					<DxLabel :text="$t('labels.date')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="decision"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="decisionOptions"
				>
					<DxLabel :text="$t('labels.decision')" />
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
					data-field="systemServiceDate"
					data-type="datetime"
					editor-type="dxDateBox"
					:editor-options="enteredStatementDateOptions"
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
			<template #statementSelectBox>
				<StatementsSelectBox
					:value="formData.registrationStatementId"
					:filter="['statementType', '=', StatementType.RegistrationStatement]"
					:readOnly="readOnly"
					@valueChanged="registrationStatementChanged"
				/>
			</template>
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
					:readOnly="!canUpdate || !fullAccess || readOnly"
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
		<SuspendServiceBasePopup
			:title="$t('labels.suspendStatement')"
			width="70vw"
			ref="suspendServiceBasePopup"
		>
			<SuspendServiceCard
				v-if="formData.suspendServiceId"
				:data="suspendService"
				:suspendStatementId="formData.id"
				@successedDeleted="deletedSuspendService"
			/>
			<SuspendServiceCreate
				v-else
				:suspendStatementId="formData.id"
				@successedSaved="createdSuspendService"
			/>
		</SuspendServiceBasePopup>
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
import SuspendServiceBasePopup from "~/components/page/popup.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";
import PaymentPopup from "~/components/agency/statements/components/payment-service/payment-popup.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";

import SuspendServiceCreate from "~/components/agency/services/suspendService/create.vue";
import SuspendServiceCard from "~/components/agency/services/suspendService/card.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { ISuspendStatement } from "~/infrastructure/interfaces/agency/statements/ISuspendStatement";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { DecisionStatuses } from "~/infrastructure/data-sources/DecisionStatuses";
import { StatementType } from "~/infrastructure/enums/StatementType";
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
		SuspendServiceBasePopup,
		SuspendServiceCard,
		SuspendServiceCreate,
		ApplicantsDataGrid,
		ApplicantsList,
		AcceptedDocumentsList,
		DocumentEditorPopup,
		PaymentPopup,
		StatementsSelectBox,
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
		let formData: ISuspendStatement = this.data;

		return {
			formData,
			StatementType,
			documentEditorVisible: false,
			documentEditorData: null,
			suspendService: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"SuspendStatement"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"SuspendStatement"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"SuspendStatement"
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
		dateBoxOptions() {
			return new DateBoxProperties({
				readOnly: true
			});
		},
		lawOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.law
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
		registrationStatementChanged(value) {
			this.formData.registrationStatementId = value;
		},
		realEstateChanged(data) {
			this.formData.realEstateId = data;
		},
		acceptedDocumentsChanged(data) {
			this.formData.acceptedDocuments = data;
		},
		onSuspendService() {
			if (this.formData.suspendServiceId) {
				let result = this.$refs["form"].instance.validate();
				if (result.isValid) {
					this.$awn.asyncBlock(
						this.$axios.get(
							`${this.$dataApi.services.suspendService}/${this.formData.suspendServiceId}`
						),
						e => {
							this.$awn.success();
							this.suspendService = e.data;
							this.$refs.suspendServiceBasePopup.open();
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			} else {
				this.$refs.suspendServiceBasePopup.open();
			}
		},
		deletedSuspendService() {
			this.$refs.suspendServiceBasePopup.close();
			this.formData.suspendServiceId = null;
		},
		createdSuspendService(data) {
			this.$refs.suspendServiceBasePopup.close();
			this.formData.suspendServiceId = data.id;
		},
		onDownload() {
			DocumentLoader.load(this, {
				loadUrl: `${this.$dataApi.download.suspendStatement}/${this.formData.id}`,
				name: `${this.$t("navigation.agency.suspendStatementTitle")}.docx`
			});
		},
		onPrint() {
			if (this.documentEditorData === null) {
				this.$awn.asyncBlock(
					this.$axios.get(
						`${this.$dataApi.getHtml.suspendStatement}/${this.formData.id}`
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
						`${this.$dataApi.statements.suspendStatement}/${this.formData.id}`,
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
							`${this.$dataApi.statements.suspendStatement}/${this.formData.id}`
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