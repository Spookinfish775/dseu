<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<Card :data="currentData" @successedDeleted="successedDeleted" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import Card from "~/components/agency/statements/legalAidStatement/card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		Card
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createLegalAidStatement"
			);
		},
		pageTitle(): string {
			let title: string = `${this.organization.name} - ${this.$t(
				this.block.title
			)}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(
			`${dataApi.statements.legalAidStatement}/${+params.id}`
		);
		const organization = await $axios.get(
			`${dataApi.organization}/${+data.organizationId}`
		);

		return {
			currentData: data,
			organization: organization.data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>