<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<PaymentCard :data="currentPayment" @successedDeleted="successedDeleted" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PaymentCard from "~/components/agency/paymentServices/payment/payment-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		PaymentCard
	},
	data() {
		return {
			currentPayment: null
		};
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.payment");
		},
		pageTitle(): string {
			let title: string = `${this.$t(this.block.title)} №${this.currentPayment.statementIndex}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.payment}/${+params.id}`);
		return {
			currentPayment: data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>

<style scoped></style>
