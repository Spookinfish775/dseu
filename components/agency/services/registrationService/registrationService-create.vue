<template>
	<div class="card-wrapper">
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
				<DxSimpleItem
					data-field="registrationStatementId"
					data-type="number"
					template="statementSelectBox"
				>
					<DxLabel :text="$t('labels.registrationStatement')" />
					<DxRequiredRule
						:message="$t('notifications.required.registrationStatement')"
					/>
				</DxSimpleItem>
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
					data-field="blankId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="blankOptions"
				>
					<DxLabel :text="$t('labels.blank')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="enteredServiceDate"
					data-type="datetime"
					editor-type="dxDateBox"
					:editor-options="enteredServiceDateOptions"
				>
					<DxRequiredRule />
					<DxLabel :text="$t('labels.enteredServiceDate')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="certificateIndex"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.certificateIndex')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="registrationServiceNumber"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="registrationServiceNumberOptions"
				>
					<DxLabel :text="$t('labels.registrationServiceNumber')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="note"
					data-type="string"
					editor-type="dxTextArea"
					:col-span="2"
					:editor-options="textAreaOptions"
				>
					<DxLabel :text="$t('labels.note')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #statementSelectBox>
				<StatementsSelectBox
					:value="formData.registrationStatementId"
					:filter="['statementType', '=', StatementType.RegistrationStatement]"
					@valueChanged="registrationStatementChanged"
				/>
			</template>
		</DxForm>
		<!-- <RealEstatePartGrid
			:realEstateId="realEstateId"
			@valueSelected="changeRealEstatePart"
		/> -->
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
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import RealEstatePartGrid from "~/components/agency/services/components/realEstatePart-grid/index.vue";

import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { StatementType } from "~/infrastructure/enums/StatementType";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { RegistrationService } from "~/infrastructure/classes/agency/services/RegistrationService";
import { IRegistrationService } from "~/infrastructure/interfaces/agency/services/IRegistrationService";
import { blankState } from "~/infrastructure/enums/agency/blankState";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { BookType } from "~/infrastructure/enums/BookType";

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
		StatementsSelectBox,
		RealEstatePartGrid
	},
	data() {
		let formData: IRegistrationService = new RegistrationService();

		return {
			formData,
			StatementType,
			realEstateId: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"RefusalService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"RefusalService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"RefusalService"
			];
			return PermissionControler.fullAccess(permission);
		},
		enteredServiceDateOptions() {
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
		registrationServiceNumberOptions() {
			return new TextBoxProperties({
				readOnly: true
			});
		},
		blankOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.blank,
				filter: ["blankState", "=", blankState.Empty],
				displayExpr: "number"
			});
		},
		chapterNumberOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: `${this.$dataApi.chapterNumberRegistrationService}/${this.formData.registrationStatementId}`,
				filter: ["isUsed", "=", false],
				readOnly: this.formData.registrationStatementId == null,
				key: "number",
				displayExpr: "number",
				valueExpr: "number",
				searchExpr: "number"
			});
		},
		registrationStatementId() {
			return this.formData.registrationStatementId;
		},
		index() {
			return this.formData.index;
		},
		enteredServiceDate() {
			return this.formData.enteredServiceDate;
		}
	},
	watch: {
		registrationStatementId() {
			this.getRegistrationServiceNumber();
		},
		index() {
			this.getRegistrationServiceNumber();
		},
		enteredServiceDate() {
			this.getRegistrationServiceNumber();
		}
	},
	methods: {
		async getRegistrationServiceNumber() {
			if (
				this.registrationStatementId &&
				this.index &&
				this.enteredServiceDate
			) {
				const { data } = await this.$axios.get(
					this.$dataApi.getRegistrationNumber,
					{
						params: {
							BookType: BookType.RegistrationServiceBook,
							RegistrationStatementId: this.registrationStatementId,
							Index: this.index,
							EnteredRegistrationDate: this.enteredServiceDate
						}
					}
				);
				this.formData.registrationServiceNumber = data;
			}
		},
		registrationStatementChanged(value) {
			this.formData.registrationStatementId = value;
			this.loadRegistationStatement(value);
		},
		async loadRegistationStatement(id) {
			if (id) {
				const { data } = await this.$axios.get(
					`${this.$dataApi.statements.registrationStatement}/${id}`
				);
				this.realEstateId = data.realEstateId;
			} else {
				this.realEstateId = null;
			}
		},
		changeRealEstatePart(data) {
			this.formData.realEstatePartId = data;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(
						this.$dataApi.services.registrationService,
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
			this.loadRegistationStatement(this.formData.registrationStatementId);
		}
	}
});
</script>