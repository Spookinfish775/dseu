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
					data-field="realEstateId"
					data-type="number"
					template="realEstateSelectBox"
				>
					<DxLabel :text="$t('labels.realEstate')" />
					<DxRequiredRule :message="$t('notifications.required.realEstate')" />
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
					<DxRequiredRule :message="$t('notifications.required.law')" />
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
				>
					<DxLabel :text="$t('labels.isDeal')" location="left" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="enteredStatementDate"
					editor-type="dxDateBox"
					:editor-options="enteredStatementDateOptions"
				>
					<DxRequiredRule />
					<DxLabel :text="$t('labels.enteredStatementDate')" />
				</DxSimpleItem>
        <DxSimpleItem
					data-field="letterSenderOrganizationId"
					data-type="number"
					template="letterSenderOrganizationSelectBox"
				>
					<DxLabel :text="$t('labels.letterSenderOrganization')" />
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
			<template #conventionalNumberTextBox>
				<ConventionalNumberTextBox
					:value="formData.conventionalNumber"
					:readOnly="true"
					:disabled="haveConventionalNumber"
					@valueChanged="conventionalNumberChanged"
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
import ApplicantsList from "~/components/agency/statements/components/applicants/applicant-list/index.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import RealEstateSelectBox from "~/components/realEstate/realEstate-select-box/index.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";
import ConventionalNumberTextBox from "~/components/agency/statements/components/conventionalNumber/text-box.vue";

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
		ApplicantsList,
		AcceptedDocumentsDataGrid,
		AcceptedDocumentsList,
		RealEstateSelectBox,
		ApplicantSelectBox,
		ConventionalNumberTextBox
	},
	props: {
		data: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		let formData: IRegistrationStatement = new RegistrationStatement(this.data);

		return {
			formData,
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
		enteredStatementDateOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
				type: "datetime",
				applyValueMode: "useButtons"
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
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (this.formData.acceptedDocuments.length === 0) {
				result.isValid = false;
				alert(this.$t("errors.needAcceptedDocuments"), this.$t(`errors.title`));
			}
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(
						this.$dataApi.statements.registrationStatement,
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
	}
});
</script>
