<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<PrepaymentCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PrepaymentCreate from "~/components/agency/paymentServices/prepayment/prepayment-create.vue";

export default Vue.extend({
	// middleware: ["administration/users/create"],
	components: {
		PageHeader,
		PrepaymentCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createPrepayment"
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
				`/agency/paymentServices/prepayment/${prepayment.id}`
			);
		}
	}
});
</script>

<style scoped></style>
