<template>
	<div>
		<PageHeader :title="pageTitle" :description="pageDescription" />
		<RealEstateDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RealEstateDataGrid from "~/components/realEstate/realEstate-data-grid.vue";

export default Vue.extend({
	middleware: ["territorialUnit/index"],
	components: {
		PageHeader,
		RealEstateDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("realEstate");
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
