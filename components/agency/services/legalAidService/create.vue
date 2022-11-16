<template>
	<div class="card-wrapper">
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxGroupItem :caption="$t('labels.generalInformation')">
				<DxSimpleItem
					data-field="legalAidStatementId"
					data-type="number"
					template="statementSelectBox"
				>
					<DxLabel :text="$t('labels.suspendStatement')" />
					<DxRequiredRule />
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
			<template #statementSelectBox>
				<StatementsSelectBox
					:value="formData.legalAidStatementId"
					:filter="['statementType', '=', StatementType.LegalAidStatement]"
					:readOnly="legalAidStatementId != null"
					@valueChanged="value => (formData.legalAidStatementId = value)"
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
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";

import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { StatementType } from "~/infrastructure/enums/StatementType";
import { LegalAidService } from "~/infrastructure/classes/agency/services/LegalAidService";
import { ILegalAidService } from "~/infrastructure/interfaces/agency/services/ILegalAidService";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

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
		StatementsSelectBox
	},
	props: {
		legalAidStatementId: {
			type: Number,
			default: null
		}
	},
	data() {
		let formData: ILegalAidService = new LegalAidService();

		return {
			formData,
			StatementType
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"LegalAidService"
			];
			return PermissionControler.fullAccess(permission);
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
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(
						`${this.$dataApi.services.legalAidService}`,
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
		this.formData.legalAidStatementId = this.legalAidStatementId;
	}
});
</script>