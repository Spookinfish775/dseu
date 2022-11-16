<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<PrepaymentCard
			:data="currentPrepayment"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PrepaymentCard from "~/components/agency/paymentServices/prepayment/prepayment-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		PrepaymentCard
	},
	data() {
		return {
			currentPrepayment: null
		};
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.prepayment"
			);
		},
		pageTitle(): string {
			let title: string = `${this.$t(this.block.title)} №${this.currentPrepayment.statementIndex}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.prepayment}/${+params.id}`);
		return {
			currentPrepayment: data
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
