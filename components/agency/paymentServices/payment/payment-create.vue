<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="savePayment" />
		<DxForm ref="form" label-location="top" :form-data.sync="payment">
			<DxGroupItem :caption="$t('labels.generalInformation')">
				<DxSimpleItem
					data-field="prepaymentId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="prepaymentOptions"
				>
					<DxLabel :text="$t('labels.prepayment')" />
					<DxRequiredRule
						:message="$t('notifications.required.prepayment')"
					/>
				</DxSimpleItem>
				<DxSimpleItem data-field="receipts" template="receiptsList">
					<DxLabel :text="$t('labels.receipts')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #receiptsList>
				<ReceiptsDataGreed @valueChanged="receiptsChanged" />
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

import BaseToolbar from "~/components/page/base-toolbar.vue";

import ReceiptsDataGreed from "./receipts-data-greed.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";

import { Payment } from "~/infrastructure/classes/agency/paymentServices/Payment";
import { IPayment } from "~/infrastructure/interfaces/agency/paymentServices/IPayment";
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
		ReceiptsDataGreed
	},
	data() {
		let payment: IPayment = new Payment();
		return {
			payment
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Payment"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Payment"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Payment"];
			return PermissionControler.fullAccess(permission);
		},
		prepaymentOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.prepayment,
				displayExpr: "statementIndex",
				filter: ["isPaid", "=", false]
			});
		}
	},
	methods: {
		receiptsChanged(receipts) {
			this.payment.receipts = receipts;
		},
		savePayment() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.payment, this.payment),
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
		if (this.$route.query.prepaymentId) {
			this.payment.prepaymentId = +this.$route.query.prepaymentId;
		}
	}
});
</script>

