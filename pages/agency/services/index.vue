<template>
	<div>
		<PageHeader
			:title="pageTitle"
			:description="pageDescription"
			:showBackBtn="true"
		/>
		<ServicesDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import ServicesDataGrid from "~/components/agency/services/services-data-grid.vue";

export default Vue.extend({
	components: {
		PageHeader,
		ServicesDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.services"
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