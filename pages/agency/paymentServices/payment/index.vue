<template>
	<div>
		<PageHeader
			:title="pageTitle"
			:description="pageDescription"
			:showBackBtn="true"
		/>
		<PaymentDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PaymentDataGrid from "~/components/agency/paymentServices/payment/payment-data-grid.vue";

export default Vue.extend({
	components: {
		PageHeader,
		PaymentDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.payment");
		},
		pageTitle() {
			let title: string = this.$t(this.block.title);
			return title;
		},
		pageDescription() {
			let description: string = this.$t(this.block.description);
			return description;
		}
	}
});
</script>

<style scoped></style>
