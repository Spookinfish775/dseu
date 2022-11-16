<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<CreateCard @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import CreateCard from "~/components/administration/letterSenderOrganization/create.vue";

export default Vue.extend({
	middleware: ["administration/users/create"],
	components: {
		PageHeader,
		CreateCard
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"administration.createLetterSenderOrganization"
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
		successedSaved(user) {
			this.$router.replace(`/administration/letterSenderOrganization/${user.id}`);
		}
	}
});
</script>

<style scoped></style>
