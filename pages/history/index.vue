<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<HistoryDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import HistoryDataGrid from "~/components/history/history-data-grid.vue";
export default Vue.extend({
	middleware: ["history"],
	components: {
		PageHeader,
		HistoryDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("history");
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
