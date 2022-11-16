<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<OrganizationCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import OrganizationCreate from "~/components/administration/organization/organization-create.vue";

export default Vue.extend({
	middleware: ["administration/users/create"],
	components: {
		PageHeader,
		OrganizationCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"administration.createOrganization"
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
	},
	methods: {
		successedSaved(data) {
			this.$router.replace(`/administration/organization/${data.id}`);
		}
	}
});
</script>