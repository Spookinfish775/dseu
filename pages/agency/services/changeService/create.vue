<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<ChangeServiceCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import ChangeServiceCreate from "~/components/agency/services/changeService/create.vue";

export default Vue.extend({
	// middleware: ["administration/users/create"],
	components: {
		PageHeader,
		ChangeServiceCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createChangeService"
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
			this.$router.replace(`/agency/services/changeService/${statement.id}`);
		}
	}
});
</script>