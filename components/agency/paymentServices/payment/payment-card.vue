<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="savePayment"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="payment"
		>
			<DxGroupItem :caption="$t('labels.generalInformation')">
				<DxSimpleItem
					data-field="prepaymentId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="prepaymentOptions"
				>
					<DxLabel :text="$t('labels.prepayment')" />
					<DxRequiredRule :message="$t('notifications.required.prepayment')" />
				</DxSimpleItem>
				<DxSimpleItem data-field="receipts" template="receiptsList">
					<DxLabel :text="$t('labels.receipts')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #receiptsList>
				<ReceiptsDataGreed
					:data="payment.receipts"
					@valueChanged="receiptsChanged"
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

import ReceiptsDataGreed from "./receipts-data-greed.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";

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
		let payment: IPayment = this.data;
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
				displayExpr: "statementIndex"
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
					this.$axios.put(
						`${this.$dataApi.payment}/${this.payment.id}`,
						this.payment
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
							`${this.$dataApi.payment}/${this.payment.id}`
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

