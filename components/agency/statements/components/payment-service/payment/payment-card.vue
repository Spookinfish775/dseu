<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="true"
			:canDelete="havePayment"
			@save="savePayment"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="payment"
			:read-only="readOnly"
		>
			<DxGroupItem :caption="$t('navigation.agency.paymentTitle')">
				<DxSimpleItem data-field="receipts" template="receiptsList">
					<DxLabel :text="$t('labels.receipts')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #receiptsList>
				<ReceiptsDataGreed
					:read-only="readOnly"
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
			payment,
		};
	},
	computed: {
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"ManipulateTerritorialUnit"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"RegistrationOfStatement"
			];
			return PermissionControler.fullAccess(permission);
		},
		havePayment() {
			return this.payment.id ? true : false;
		}
	},
	methods: {
		receiptsChanged(receipts) {
			this.payment.receipts = receipts;
		},
		createPayment() {
			this.$awn.asyncBlock(
				this.$axios.post(this.$dataApi.payment, this.payment),
				e => {
					this.$awn.success();
					this.updateForm(e.data);
					this.$emit("successedSaved", e.data);
				},
				e => {
					this.$awn.alert();
				}
			);
		},
		updatePayment() {
			this.$awn.asyncBlock(
				this.$axios.put(
					`${this.$dataApi.payment}/${this.payment.id}`,
					this.payment
				),
				e => {
					this.$awn.success();
					this.updateForm(e.data);
					this.$emit("successedSaved", e.data);
				},
				e => {
					this.$awn.alert();
				}
			);
		},
		savePayment() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				if (this.havePayment) {
					this.updatePayment();
				} else {
					this.createPayment();
				}
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
						this.$axios.delete(`${this.$dataApi.payment}/${this.payment.id}`),
						e => {
							this.$awn.success();
							this.updateForm(new Payment());
							this.$emit("successedDeleted");
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			});
		},
		updateForm(data) {
			this.$refs["form"].instance.updateData(data);
			this.payment = data;
			this.$refs["form"].instance.repaint();
		}
	}
});
</script>

