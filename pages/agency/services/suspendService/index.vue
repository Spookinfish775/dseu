<template>
	<div>
		<PageHeader
			:title="pageTitle"
			:description="pageDescription"
			:showBackBtn="true"
		/>
		<DataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import DataGrid from "~/components/agency/services/suspendService/data-grid.vue";

export default Vue.extend({
	components: {
		PageHeader,
		DataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.suspendService");
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