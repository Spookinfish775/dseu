<template>
	<div>
		<PageHeader
			:title="pageTitle"
			:description="pageDescription"
			:showBackBtn="true"
		/>
		<UserBooksDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import UserBooksDataGrid from "~/components/agency/books/userBooks/userBooks-data-grid.vue";

export default Vue.extend({
	components: {
		PageHeader,
		UserBooksDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.userBooks");
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
