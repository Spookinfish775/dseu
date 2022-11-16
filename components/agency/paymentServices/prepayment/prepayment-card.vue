<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="savePrepayment"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="prepayment"
		>
			<DxGroupItem :col-count="2" :caption="$t('labels.generalInformation')">
				<DxSimpleItem
					data-field="statementId"
					data-type="number"
					template="statementSelectBox"
				>
					<DxLabel :text="$t('labels.statement')" />
					<DxRequiredRule :message="$t('notifications.required.statement')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="applicantType"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="applicantTypeOptions"
				>
					<DxLabel :text="$t('labels.applicantType')" />
					<DxRequiredRule
						:message="$t('notifications.required.applicantType')"
					/>
				</DxSimpleItem>
				<DxSimpleItem
					data-field="governmentDutyId"
					data-type="number"
					template="governmentDutySelectBox"
					:col-span="2"
				>
					<DxLabel :text="$t('labels.governmentDuty')" />
					<DxRequiredRule
						:message="$t('notifications.required.governmentDuty')"
					/>
				</DxSimpleItem>
				<DxSimpleItem
					data-field="isUrgent"
					data-type="boolean"
					editor-type="dxCheckBox"
				>
					<DxLabel location="left" :text="$t('labels.isUrgent')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="hasTehnicalService"
					data-type="boolean"
					editor-type="dxCheckBox"
				>
					<DxLabel location="left" :text="$t('labels.hasTehnicalService')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="sum"
					data-type="number"
					editor-type="dxNumberBox"
					:editor-options="sumOptions"
					:col-span="2"
				>
					<DxLabel :text="$t('labels.sum')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="governmentDutyCoast"
					data-type="number"
					editor-type="dxNumberBox"
					:editor-options="sumOptions"
				>
					<DxLabel :text="$t('labels.governmentDutyCoast')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="tehnicalServiceCoast"
					data-type="number"
					editor-type="dxNumberBox"
					:editor-options="sumOptions"
				>
					<DxLabel :text="$t('labels.tehnicalServiceCoast')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #statementSelectBox>
				<StatementsSelectBox
					:value="prepayment.statementId"
					@valueChanged="statementChanged"
				/>
			</template>
			<template #governmentDutySelectBox>
				<GovernmentDutySelectBox
					:value="prepayment.governmentDutyId"
					@valueChanged="value => (prepayment.governmentDutyId = value)"
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import DxTagBox from "devextreme-vue/tag-box";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import GovernmentDutySelectBox from "~/components/administration/governmentDuty/governmentDuty-select-box/index.vue";

import { ApplicantTypes } from "~/infrastructure/data-sources/ApplicantTypes";

import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";

import { IPrepayment } from "~/infrastructure/interfaces/agency/paymentServices/IPrepayment";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxButtonItem,
		DxTagBox,
		DxTextArea,
		BaseToolbar,
		StatementsSelectBox,
		GovernmentDutySelectBox
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
		let prepayment: IPrepayment = this.data;
		return {
			prepayment
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Prepayment"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Prepayment"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Prepayment"];
			return PermissionControler.fullAccess(permission);
		},
		applicantTypeOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: ApplicantTypes(this)
			});
		},
		statementOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.statements.statement,
				displayExpr: "index"
			});
		},
		sumOptions() {
			return new NumberBoxProperties({
				readOnly: true
			});
		}
	},
	methods: {
		statementChanged(value) {
			this.prepayment.statementId = value;
		},
		savePrepayment() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.prepayment}/${this.prepayment.id}`,
						this.prepayment
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
							`${this.$dataApi.prepayment}/${this.prepayment.id}`
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
		}
	}
});
</script>

