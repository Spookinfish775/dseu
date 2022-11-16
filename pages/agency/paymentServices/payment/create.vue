<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<PaymentCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PaymentCreate from "~/components/agency/paymentServices/payment/payment-create.vue";

export default Vue.extend({
	// middleware: ["administration/users/create"],
	components: {
		PageHeader,
		PaymentCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createPayment"
			);
		},
		pageTitle() {
			let title: string = this.$t(this.block.title);
			return title;
		},
		pageDescription() {
			let description: string = this.$t(this.block.description);
			return description;
		}
	},
	methods: {
		successedSaved(prepayment) {
			this.$router.replace(
				`/agency/paymentServices/payment/${prepayment.id}`
			);
		}
	}
});
</script>

<style scoped></style>
