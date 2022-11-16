<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<Card
			:data="currentData"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import Card from "~/components/agency/services/confirmationService/card.vue";
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
				"agency.legalAidService"
			);
		},
		pageTitle(): string {
			let title: string = `${this.$t(this.block.title)} №${
				this.currentData.id
			}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(
			`${dataApi.services.confirmationService}/${+params.id}`
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