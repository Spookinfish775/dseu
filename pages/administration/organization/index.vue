<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<OrganizationTreeList />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import OrganizationTreeList from "~/components/administration/organization/organization-tree-list.vue";
export default Vue.extend({
	middleware: ["administration/manipulate-with-data-book-entries"],
	components: {
		PageHeader,
		OrganizationTreeList
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("administration.organizationDataBookEntry");
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
