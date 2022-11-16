<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<Card :data="currentData" @successedDeleted="successedDeleted" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import Card from "~/components/administration/letterSenderOrganization/card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	middleware: ["administration/users/index"],
	components: {
		PageHeader,
		Card
	},
	data() {
		return {
			currentData: null
		};
	},
	computed: {
		pageTitle(): string {
			let title: string = `${this.$t(
				"navigation.administration.letterSenderOrganizationTitle"
			)}: ${this.currentData.name}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(
			`${dataApi.letterSenderOrganization}/${params.id}`
		);
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
