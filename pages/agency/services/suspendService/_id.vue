<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<SuspendServiceCard
			:data="currentData"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import SuspendServiceCard from "~/components/agency/services/suspendService/card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		SuspendServiceCard
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.suspendService"
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
			`${dataApi.services.suspendService}/${+params.id}`
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