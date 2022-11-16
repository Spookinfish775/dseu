<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<RolesDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RolesDataGrid from "~/components/administration/roles/roles-data-grid.vue";
export default Vue.extend({
	middleware: ["administration/roles/index"],

	components: {
		PageHeader,
		RolesDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"administration.roles"
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
