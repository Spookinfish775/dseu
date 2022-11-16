<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<OrganizationCard
			:data="currentData"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import OrganizationCard from "~/components/administration/organization/organization-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	middleware: ["administration/users/index"],
	components: {
		PageHeader,
		OrganizationCard
	},
	computed: {
		pageTitle(): string {
			let title: string = `${this.currentData.name}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.organization}/${params.id}`);

		return {
			currentData: data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>