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
					data-field="enteredStatementDate"
					data-type="datetime"
					editor-type="dxDateBox"
					:editor-options="enteredStatementDateOptions"
				>
					<DxLabel :text="$t('labels.enteredStatementDate')" />
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
					@valueChanged="registrationStatementChanged"
				/>
			</template>
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
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SuspendStatement } from "~/infrastructure/classes/agency/statements/SuspendStatement";
import { ISuspendStatement } from "~/infrastructure/interfaces/agency/statements/ISuspendStatement";
import { StatementType } from "~/infrastructure/enums/StatementType";
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
		DxAsyncRule,
		DxPatternRule,
		DxButtonItem,
		DxTextArea,
		BaseToolbar,
		ApplicantsDataGrid,
		ApplicantsList,
		AcceptedDocumentsList,
		RealEstateSelectBox,
		StatementsSelectBox,
		ApplicantSelectBox
	},
	props: {
		data: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		let formData: ISuspendStatement = new SuspendStatement(this.data);

		return {
			formData,
			StatementType,
			partOfRightPattern: /^[0-9][/][0-9]+$/
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
		lawOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.law
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
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(
						this.$dataApi.statements.suspendStatement,
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
		}
	},
	created() {
		if (this.$route.query.registrationStatement) {
			this.formData.registrationStatementId = Number(
				this.$route.query.registrationStatement
			);
		}
	}
});
</script>