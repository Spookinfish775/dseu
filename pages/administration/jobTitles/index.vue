<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<JobTitlesDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import JobTitlesDataGrid from "~/components/administration/jobTitles/jobTitles-data-grid.vue";
export default Vue.extend({
	middleware: ["administration/users/index"],
	components: {
		PageHeader,
		JobTitlesDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"administration.jobTitles"
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
