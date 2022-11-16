<template>
	<div>
		<PageHeader
			:title="pageTitle"
			:description="pageDescription"
			:showBackBtn="true"
		/>
		<PageGuideBlock :items="block.items" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PageGuideBlock from "~/components/page/guide/block.vue";

export default Vue.extend({
	components: {
		PageHeader,
		PageGuideBlock
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.paymentServices"
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
	}
});
</script>

<style scoped></style>
