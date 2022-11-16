<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<IdentityDocumentSeriesDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import IdentityDocumentSeriesDataGrid from "~/components/administration/identityDocumentSeries/data-grid.vue";
export default Vue.extend({
	middleware: ["administration/manipulate-with-data-book-entries"],
	components: {
		PageHeader,
		IdentityDocumentSeriesDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("administration.identityDocumentSeries");
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