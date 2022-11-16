<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<RegistrationStatementCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RegistrationStatementCreate from "~/components/agency/statements/registrationStatement/create.vue";

export default Vue.extend({
	// middleware: ["administration/users/create"],
	components: {
		PageHeader,
		RegistrationStatementCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createRegistrationStatement"
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
		successedSaved(statement) {
			this.$router.replace(
				`/agency/statements/registrationStatement/${statement.id}`
			);
		}
	}
});
</script>

<style scoped></style>
