<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<UserCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import UserCreate from "~/components/administration/users/users-create.vue";

export default Vue.extend({
	middleware: ["administration/users/create"],
	components: {
		PageHeader,
		UserCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"administration.createUsers"
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
			this.$router.replace(`/administration/users/${user.id}`);
		}
	}
});
</script>

<style scoped></style>
