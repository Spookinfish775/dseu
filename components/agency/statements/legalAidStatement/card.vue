<template>
	<div class="card-wrapper">
		<BaseToolbar
			:canSave="canUpdate"
			:canDelete="fullAccess"
			:havePayment="true"
			:haveLegalAidService="true"
			@payment="$refs['paymentPopup'].open()"
			@legalAidService="onLegalAidService"
			@save="onSave"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="formData"
		>
			<DxSimpleItem data-field="applicantStatements" template="applicantsList">
				<DxLabel :text="$t('labels.applicants')" />
			</DxSimpleItem>
			<DxGroupItem :col-count="2">
				<DxSimpleItem
					data-field="letterSenderOrganizationId"
					data-type="number"
					template="letterSenderOrganizationSelectBox"
				>
					<DxLabel :text="$t('labels.letterSenderOrganization')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="shortDescription"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.shortDescription')" />
					<DxRequiredRule
						:message="$t('notifications.required.shortDescription')"
					/>
				</DxSimpleItem>
				<DxSimpleItem
					data-field="organizationId"
					data-type="number"
					template="organizationSelectBox"
				>
					<DxLabel :text="$t('labels.organization')" />
					<DxRequiredRule
						:message="$t('notifications.required.organization')"
					/>
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

			<template #organizationSelectBox>
				<OrganizationSelectBox
					:value="formData.organizationId"
					@valueChanged="organizationChanged"
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
			<template #letterSenderOrganizationSelectBox>
				<ApplicantSelectBox
					:value="formData.letterSenderOrganizationId"
					:filter="letterSenderOrganizationFilter"
					@valueChanged="value => (formData.letterSenderOrganizationId = value)"
				/>
			</template>
		</DxForm>
		<PaymentPopup ref="paymentPopup" :document="formData" />
		<BasePopup
			ref="legalAidServicePopup"
			:title="$t('labels.legalAidService')"
			width="70vw"
		>
			<LegalAidServiceCard
				v-if="formData.legalAidServiceId"
				:data="legalAidService"
				:legalAidStatementId="formData.id"
				@successedDeleted="deletedLegalAidService"
			/>
			<LegalAidServiceCreate
				v-else
				:legalAidStatementId="formData.id"
				@successedSaved="createdLegalAidService"
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
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";
import PaymentPopup from "~/components/agency/statements/components/payment-service/payment-popup.vue";
import LegalAidServiceCreate from "~/components/agency/services/legalAidService/create.vue";
import LegalAidServiceCard from "~/components/agency/services/legalAidService/card.vue";
import ApplicantSelectBox from "~/components/agency/statements/components/applicants/applicant-select-box/index.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { ILegalAidStatement } from "~/infrastructure/interfaces/agency/statements/ILegalAidStatement";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { DecisionStatuses } from "~/infrastructure/data-sources/DecisionStatuses";
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
		OrganizationSelectBox,
		PaymentPopup,
		BasePopup,
		LegalAidServiceCreate,
		LegalAidServiceCard,
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
		let formData: ILegalAidStatement = this.data;

		return {
			formData,
			legalAidService: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidStatement"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidStatement"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidStatement"
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
		organizationChanged(data) {
			this.formData.organizationId = data;
		},
		onLegalAidService() {
			if (this.formData.legalAidServiceId) {
				let result = this.$refs["form"].instance.validate();
				if (result.isValid) {
					this.$awn.asyncBlock(
						this.$axios.get(
							`${this.$dataApi.services.legalAidService}/${this.formData.legalAidServiceId}`
						),
						e => {
							this.$awn.success();
							this.legalAidService = e.data;
							this.$refs.legalAidServicePopup.open();
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			} else {
				this.$refs.legalAidServicePopup.open();
			}
		},
		deletedLegalAidService() {
			this.$refs.legalAidServicePopup.close();
			this.formData.legalAidServiceId = null;
		},
		createdLegalAidService(data) {
			this.$refs.legalAidServicePopup.close();
			this.formData.legalAidServiceId = data.id;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.statements.legalAidStatement}/${this.formData.id}`,
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
		onDelete() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(
							`${this.$dataApi.statements.legalAidStatement}/${this.formData.id}`
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