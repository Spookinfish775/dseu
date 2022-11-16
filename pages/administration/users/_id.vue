<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<UserCard :data="currentUser" @successedDeleted="successedDeleted" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import UserCard from "~/components/administration/users/users-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	middleware: ["administration/users/index"],
	components: {
		PageHeader,
		UserCard
	},
	data() {
		return {
			currentUser: null
		};
	},
	computed: {
		pageTitle(): string {
			let title: string = `${this.currentUser.firstName} ${this.currentUser.lastName} ${this.currentUser.middleName}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.user}/${params.id}`);

		return {
			currentUser: data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>

<style scoped></style>
