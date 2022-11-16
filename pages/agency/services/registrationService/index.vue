<template>
	<div>
		<PageHeader
			:title="pageTitle"
			:description="pageDescription"
			:showBackBtn="true"
		/>
		<RegistrationServiceDataGrid />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RegistrationServiceDataGrid from "~/components/agency/services/registrationService/registrationService-data-grid.vue";

export default Vue.extend({
	components: {
		PageHeader,
		RegistrationServiceDataGrid
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.registrationService"
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
