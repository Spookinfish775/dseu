<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<Card :data="currentValue" @successedDeleted="successedDeleted" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import Card from "~/components/agency/caseRelationship/card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		Card
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.caseRelationship");
		},
		pageTitle(): string {
			let title: string = `${this.$t(this.block.title)}: ${
				this.currentValue.id
			}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.caseRelationship}/${+params.id}`);
		return {
			currentValue: data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>