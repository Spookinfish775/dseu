<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<LegalAidServiceCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import LegalAidServiceCreate from "~/components/agency/services/legalAidService/create.vue";

export default Vue.extend({
	// middleware: ["administration/users/create"],
	components: {
		PageHeader,
		LegalAidServiceCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createLegalAidService"
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
				`/agency/services/legalAidService/${statement.id}`
			);
		}
	}
});
</script>