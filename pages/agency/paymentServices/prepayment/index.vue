<template>
	<div>
		<PageHeader
			:title="pageTitle"
			:description="pageDescription"
			:showBackBtn="true"
		/>
		<PrepaymentDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PrepaymentDataGrid from "~/components/agency/paymentServices/prepayment/prepayment-data-grid.vue";

export default Vue.extend({
	components: {
		PageHeader,
		PrepaymentDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.prepayment");
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
