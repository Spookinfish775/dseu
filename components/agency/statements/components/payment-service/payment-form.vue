<template>
	<div>
		<div v-if="prepaymentLoaded && paymentLoaded">
			<DxTabPanel :data-source="tabs" :selected-index="selectedIndex">
				<template #title="{ data: tab }">
					<span>{{ tab.title }}</span>
				</template>
				<template #item="{ data: tab }">
					<component
						:is="tab.component"
						class="tab-item"
						:data="tab.data"
						:read-only="tab.readOnly"
						@successedSaved="fullCheck"
						@successedDeleted="fullCheck"
					/>
				</template>
			</DxTabPanel>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxTabPanel, { DxItem } from "devextreme-vue/tab-panel";

import PrepaymentCard from "./prepayment-card.vue";
import PaymentCard from "./payment/payment-card.vue";

import { Prepayment } from "~/infrastructure/classes/agency/paymentServices/Prepayment";
import { IPrepayment } from "~/infrastructure/interfaces/agency/paymentServices/IPrepayment";

import { Payment } from "~/infrastructure/classes/agency/paymentServices/Payment";
import { IPayment } from "~/infrastructure/interfaces/agency/paymentServices/IPayment";

export default Vue.extend({
	components: {
		DxTabPanel,
		DxItem,
		PrepaymentCard,
		PaymentCard
	},
	props: {
		document: {
			type: Object,
			required: true
		}
	},
	data() {
		let prepayment: IPrepayment = new Prepayment();
		let payment: IPayment = new Payment();
		return {
			prepayment,
			payment,
			prepaymentLoaded: false,
			paymentLoaded: false,
			selectedIndex: 0
		};
	},
	computed: {
		tabs() {
			return [
				{
					title: this.$t("navigation.agency.prepaymentTitle"),
					component: "PrepaymentCard",
					data: this.prepayment,
					readOnly: this.onlyReadPayment
				},
				{
					title: this.$t("navigation.agency.paymentTitle"),
					component: "PaymentCard",
					data: this.payment,
					readOnly: this.onlyReadPayment
				}
			];
		},
		onlyReadPayment() {
			return this.payment.isRegistered;
		}
	},
	methods: {
		async checkPrepayment() {
			this.prepaymentLoaded = false;

			try {
				const { data } = await this.$axios.get(
					`${this.$dataApi.prepayment}/statement/${+this.document.id}`
				);
				if (data) {
					this.prepayment = {
						...data
					};
				} else {
					this.prepayment = new Prepayment();
				}
				this.prepayment.statementId = this.document.id;
				this.prepaymentLoaded = true;
			} catch (error) {}
		},
		async checkPayment() {
			this.paymentLoaded = false;
			try {
				const { data } = await this.$axios.get(
					`${this.$dataApi.payment}/statement/${+this.document.id}`
				);
				if (data) {
					this.payment = {
						...data
					};
				} else {
					this.payment = new Payment();
				}
				this.payment.prepaymentId = this.prepayment.id;
				this.paymentLoaded = true;
			} catch (error) {}
		},
		async fullCheck() {
			this.selectedIndex += 1;
			await this.checkPrepayment();
			await this.checkPayment();
		}
	},
	async created() {
		await this.checkPrepayment();
		await this.checkPayment();
		setTimeout(() => {}, 300);
	}
});
</script>

<style lang="scss">
.tab-item {
	padding: 20px 10px;
}
</style>