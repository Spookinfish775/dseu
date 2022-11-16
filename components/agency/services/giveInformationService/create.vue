<template>
	<div class="card-wrapper">
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
				<DxSimpleItem
					data-field="giveInformationStatementId"
					data-type="number"
					template="statementSelectBox"
				>
					<DxLabel :text="$t('labels.giveInformationStatement')" />
					<DxRequiredRule />
				</DxSimpleItem>
        <DxSimpleItem
          data-field="extractIndex"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.giveInformationServiceExtractIndex')"/>
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
			</DxGroupItem>
			<template #statementSelectBox>
				<StatementsSelectBox
					:value="formData.giveInformationStatementId"
					:filter="[
						'statementType',
						'=',
						StatementType.GiveInformationStatement
					]"
					:readOnly="giveInformationStatementId != null"
					@valueChanged="value => (formData.giveInformationStatementId = value)"
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

import { StatementType } from "~/infrastructure/enums/StatementType";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { GiveInformationService } from "~/infrastructure/classes/agency/services/GiveInformationService";
import { IGiveInformationService } from "~/infrastructure/interfaces/agency/services/IGiveInformationService";
import { blankState } from "~/infrastructure/enums/agency/blankState";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";

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
		giveInformationStatementId: {
			type: Number,
			default: null
		}
	},
	data() {
		let formData: IGiveInformationService = new GiveInformationService();

		return {
			formData,
			StatementType
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"GiveInformationService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"GiveInformationService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"GiveInformationService"
			];
			return PermissionControler.fullAccess(permission);
		},
    textBoxOptions(){
      return new TextBoxProperties();
    },
		blankOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.blank,
				filter: ["blankState", "=", blankState.Empty],
				displayExpr: "number"
			});
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
						`${this.$dataApi.services.giveInformationService}`,
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
		this.formData.giveInformationStatementId = this.giveInformationStatementId;
	}
});
</script>
