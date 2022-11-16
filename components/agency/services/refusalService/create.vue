<template>
	<div class="card-wrapper">
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
				<DxGroupItem>
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
						data-field="refusalType"
						data-type="number"
						editor-type="dxSelectBox"
						:editor-options="refusalTypeOptions"
					>
						<DxLabel :text="$t('labels.refusalType')" />
						<DxRequiredRule
							:message="$t('notifications.required.refusalType')"
						/>
					</DxSimpleItem>
				</DxGroupItem>

				<DxGroupItem>
					<DxSimpleItem
						data-field="refusalLaws"
						data-type="array"
						editor-type="dxTagBox"
						:editor-options="refusalLawOptions"
					>
						<DxLabel :text="$t('labels.refusalLaws')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="refusalReasons"
						data-type="array"
						editor-type="dxTagBox"
						:editor-options="refusalReasonsOptions"
					>
						<DxLabel :text="$t('labels.refusalReasons')" />
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
				</DxGroupItem>

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
import "devextreme-vue/text-area";
import "devextreme-vue/tag-box";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";

import { StatementType } from "~/infrastructure/enums/StatementType";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TagBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/TagBox/TagBoxPropertiesWithDataSource";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { RefusalService } from "~/infrastructure/classes/agency/services/RefusalService";
import { IRefusalService } from "~/infrastructure/interfaces/agency/services/IRefusalService";
import { RefusalTypes } from "~/infrastructure/data-sources/agency/RefusalTypes";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		BaseToolbar,
		StatementsSelectBox
	},
	data() {
		let formData: IRefusalService = new RefusalService();

		return {
			formData,
			StatementType
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
		refusalTypeOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: RefusalTypes(this)
			});
		},
		refusalLawOptions() {
			return new TagBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.refusalLaw
			});
		},
		refusalReasonsOptions() {
			return new TagBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.refusalReason
			});
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		enteredServiceDateOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
				type: "datetime",
				applyValueMode: "useButtons"
			});
		}
	},
	methods: {
		registrationStatementChanged(value) {
			this.formData.registrationStatementId = value;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(
						this.$dataApi.services.refusalService,
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