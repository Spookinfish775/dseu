<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="saveApplicant" />

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
				<DxGroupItem :col-count="3">
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
						data-field="firstName"
						data-type="string"
						editor-type="dxTextBox"
						:editor-options="textBoxOptions"
					>
						<DxLabel :text="$t('labels.firstName')" />
						<DxRequiredRule :message="$t('notifications.required.firstName')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="middleName"
						data-type="string"
						editor-type="dxTextBox"
						:editor-options="textBoxOptions"
					>
						<DxLabel :text="$t('labels.middleName')" />
					</DxSimpleItem>
				</DxGroupItem>
				<DxGroupItem :col-count="3">
					<DxSimpleItem
						data-field="isNotFullBirthDate"
						data-type="boolean"
						editor-type="dxCheckBox"
						:col-span="3"
					>
						<DxLabel :text="$t('labels.isNotFullBirthDate')" location="left" />
					</DxSimpleItem>
					<DxSimpleItem
						:visible="applicant.isNotFullBirthDate"
						data-field="shortBirthDate"
						data-type="string"
						editor-type="dxTextBox"
					>
						<DxPatternRule
							:pattern="notFullDatePattern"
							:message="$t('labels.notFullDate')"
						/>
						<DxLabel :text="$t('labels.shortBirthDate')" />
						<DxRequiredRule />
					</DxSimpleItem>
					<DxSimpleItem
						:visible="!applicant.isNotFullBirthDate"
						data-field="birthday"
						data-type="date"
						editor-type="dxDateBox"
						:editor-options="dateBoxOptions"
					>
						<DxLabel :text="$t('labels.dateOfBirth')" />
						<DxRequiredRule 
						v-if="applicant.deathDate==null && !applicant.shortDeathDate" 
						/>
					</DxSimpleItem>
					<DxSimpleItem
						data-field="placeOfBirth"
						data-type="string"
						editor-type="dxAutocomplete"
						:editor-options="placeOfBirthOptions"
					>
						<DxLabel :text="$t('labels.placeOfBirth')" />
						<DxRequiredRule
							:message="$t('notifications.required.placeOfBirth')"
							v-if="applicant.deathDate==null && !applicant.shortDeathDate"
						/>
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
							v-if="applicant.deathDate==null && !applicant.shortDeathDate"
						/>
					</DxSimpleItem>
				</DxGroupItem>
				<DxSimpleItem
					data-field="registration"
					data-type="string"
					editor-type="dxAutocomplete"
					:editor-options="placeOfBirthOptions"
				>
					<DxLabel :text="$t('labels.registration')" />
				</DxSimpleItem>
				<DxGroupItem :col-count="2">
					<DxSimpleItem
						data-field="gender"
						data-type="number"
						editor-type="dxSelectBox"
						:editor-options="genderOptions"
					>
						<DxLabel :text="$t('labels.gender')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="nationId"
						data-type="number"
						editor-type="dxSelectBox"
						:editor-options="nationOptions"
					>
						<DxLabel :text="$t('labels.nation')" />
					</DxSimpleItem>
				</DxGroupItem>
				<DxGroupItem :col-count="3">
					<DxSimpleItem
						data-field="isNotFullDeathDate"
						data-type="boolean"
						editor-type="dxCheckBox"
						:col-span="3"
					>
						<DxLabel :text="$t('labels.isNotFullDeathDate')" location="left" />
					</DxSimpleItem>
					<DxSimpleItem
						:visible="applicant.isNotFullDeathDate"
						data-field="shortDeathDate"
						data-type="string"
						editor-type="dxTextBox"
						:col-span="1"
					>
						<DxLabel :text="$t('labels.shortDeathDate')" />
					</DxSimpleItem>

					<DxSimpleItem
						:visible="!applicant.isNotFullDeathDate"
						data-field="deathDate"
						data-type="date"
						editor-type="dxDateBox"
						:editor-options="dateBoxOptions"
						:col-span="1"
					>
						<DxLabel :text="$t('labels.deathDate')" />
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
			</DxGroupItem>

			<DxGroupItem :col-count="2" :caption="$t('labels.identityDocument')">
				<DxGroupItem :col-count="3" :col-span="2">
					<DxSimpleItem
						data-field="identityDocument.identityDocumentTypeId"
						data-type="number"
						editor-type="dxSelectBox"
						:col-span="1"
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
						<DxRequiredRule
							v-if="applicant.applicantType !== ApplicantType.LegalEntity"
						/>
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
					editor-type="dxAutocomplete"
					:editor-options="issuedByOptions"
				>
					<DxLabel :text="$t('labels.issuedBy')" />
					<DxRequiredRule :message="$t('notifications.required.issuedBy')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="identityDocument.expiredDate"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="dateBoxOptions"
				>
					<DxLabel :text="$t('labels.identityDocumentExpiredDate')" />
				</DxSimpleItem>
			</DxGroupItem>
			<DxSimpleItem
				data-field="fullInformation"
				data-type="string"
				editor-type="dxTextArea"
				:editor-options="textAreaOptions"
			>
				<DxLabel :text="$t('labels.fullInformation')" />
			</DxSimpleItem>

			<template #representativeDocumentsDataGrid>
				<RepresentativeDocumentsDataGrid
					@valueChanged="representativeDocumentsChanged"
				/>
			</template>
		</DxForm>
		<div class="empty-space"></div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import DxForm, {
	DxGroupItem,
	DxSimpleItem,
	DxLabel,
	DxPatternRule,
	DxRequiredRule
} from "devextreme-vue/form";
import { DxAutocomplete } from "devextreme-vue/autocomplete";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RepresentativeDocumentsDataGrid from "~/components/agency/statements/components/applicants/representativeDocuments/data-grid.vue";

import { AutocompletePropertiesWithDataSource } from "~/infrastructure/components-properties/Autocomplete/AutocompletePropertiesWithDataSource";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { ApplicantTypes } from "~/infrastructure/data-sources/ApplicantTypes";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { Applicant } from "~/infrastructure/classes/Applicant";
import { IApplicant } from "~/infrastructure/interfaces/IApplicant";
import { Genders } from "~/infrastructure/data-sources/Genders";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		BaseToolbar,
		RepresentativeDocumentsDataGrid,
		DxForm,
		DxPatternRule,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxAutocomplete
	},
	data() {
		let applicant: IApplicant = new Applicant();
		return {
			applicant,
			ApplicantType,
			notFullDatePattern: /(?<=^| )\d+(\.\d+)?(?=$| )/
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Applicant"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Applicant"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Applicant"];
			return PermissionControler.fullAccess(permission);
		},
		citizenshipOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.citizenship
			});
		},
		nationOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.nation
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
					this.applicant.birthday = null;
					this.applicant.citizenshipId = null;
				}
			});
		},
		genderOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Genders(this),
				showClearButton: false
			});
		},
		placeOfBirthOptions() {
			return new AutocompletePropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.territorialUnit,
				valueExpr: "fullAddress",
				key: "fullAddress"
			});
		},
		issuedByOptions() {
			return new AutocompletePropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.letterSenderOrganization,
				valueExpr: "name",
				key: "name"
			});
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		textAreaOptions() {
			return new TextAreaProperties({
				readOnly: true
			});
		},
		dateBoxOptions() {
			return new DateBoxProperties();
		},
		series() {
			return this.applicant.identityDocument.series;
		},
		number() {
			return this.applicant.identityDocument.number;
		},
		issueDate() {
			return this.applicant.identityDocument.issueDate;
		},
		issuedBy() {
			return this.applicant.identityDocument.issuedBy;
		},
		identityDocumentTypeId() {
			return this.applicant.identityDocument.identityDocumentTypeId;
		},
		firstName() {
			return this.applicant.firstName;
		},
		lastName() {
			return this.applicant.lastName;
		},
		middleName() {
			return this.applicant.middleName;
		},
		birthday() {
			return this.applicant.birthday;
		},
		shortBirthDate() {
			return this.applicant.shortBirthDate;
		},
		placeOfBirth() {
			return this.applicant.placeOfBirth;
		},
		citizenshipId() {
			return this.applicant.citizenshipId;
		},
		registration() {
			return this.applicant.registration;
		},
		tin() {
			return this.applicant.tin;
		},
		name() {
			return this.applicant.name;
		},
		address() {
			return this.applicant.address;
		},
		applicantType() {
			return this.applicant.applicantType;
		}
	},
	watch: {
		series() {
			this.getFullInformation();
		},
		number() {
			this.getFullInformation();
		},
		issueDate() {
			this.getFullInformation();
		},
		issuedBy() {
			this.getFullInformation();
		},
		identityDocumentTypeId() {
			this.getFullInformation();
		},
		firstName() {
			this.getFullInformation();
		},
		lastName() {
			this.getFullInformation();
		},
		middleName() {
			this.getFullInformation();
		},
		birthday() {
			this.getFullInformation();
		},
		shortBirthDate() {
			this.getFullInformation();
		},
		placeOfBirth() {
			this.getFullInformation();
		},
		citizenshipId() {
			this.getFullInformation();
		},
		registration() {
			this.getFullInformation();
		},
		tin() {
			this.getFullInformation();
		},
		name() {
			this.getFullInformation();
		},
		address() {
			this.getFullInformation();
		},
		applicantType() {
			this.getFullInformation();
		}
	},
	methods: {
		representativeDocumentsChanged(data) {
			this.applicant.representativeDocuments = data;
		},
		async getFullInformation() {
			if (this.lastName !== null) {
				let { data } = await this.$axios.get(
					this.$dataApi.stringParser.applicant,
					{
						params: {
							"IdentityDocument.Series": this.series,
							"IdentityDocument.Number": this.number,
							"IdentityDocument.IssueDate": this.issueDate,
							"IdentityDocument.IssuedBy": this.issuedBy,
							"IdentityDocument.IdentityDocumentTypeId": this
								.identityDocumentTypeId,
							FirstName: this.firstName,
							LastName: this.lastName,
							MiddleName: this.middleName,
							Birthday: this.birthday,
							ShortBirthDate: this.shortBirthDate,
							PlaceOfBirth: this.placeOfBirth,
							CitizenshipId: this.citizenshipId,
							Registration: this.registration,
							TIN: this.tin,
							Name: this.name,
							Address: this.address,
							ApplicantType: this.applicantType
						}
					}
				);
				this.applicant.fullInformation = data;
			}
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

<style lang="scss">
.empty-space {
	height: 40px;
}
</style>