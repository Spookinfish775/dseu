<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<SuspendStatementCard
			:data="currentData"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import SuspendStatementCard from "~/components/agency/statements/suspendStatement/card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		SuspendStatementCard
	},
	data() {
		return {
			currentData: null
		};
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createSuspendStatement"
			);
		},
		pageTitle(): string {
			let title: string = `${this.organization.name} - ${this.$t(
				this.block.title
			)}`;
			return title;
		}
	},
	async asyncData({ $axios, params, store }) {
		const { data } = await $axios.get(
			`${dataApi.statements.suspendStatement}/${+params.id}`
		);
		const organization = await $axios.get(
			`${dataApi.organization}/${+data.organizationId}`
		);
		let options = {
			loadUrl: `${dataApi.uploadedDocument}/statement/${data.id}`
		};
		store.commit("file-manager/SET_CURRENT_DOCUMENT", JSON.parse(JSON.stringify(data)));
		store.dispatch("file-manager/loadFiles", options);
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

<style scoped></style>
