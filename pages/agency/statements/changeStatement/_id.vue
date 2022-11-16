<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<Card :data="currentData" @successedDeleted="successedDeleted" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import Card from "~/components/agency/statements/changeStatement/card.vue";
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
				"agency.createChangeStatement"
			);
		},
		pageTitle(): string {
			let title: string = `${this.organization.name} - ${this.$t(
				this.block.title
			)}: ${this.realEstate.address}`;
			return title;
		}
	},
	async asyncData({ $axios, params, store }) {
		const { data } = await $axios.get(
			`${dataApi.statements.changeStatement}/${+params.id}`
		);
		const organization = await $axios.get(
			`${dataApi.organization}/${+data.organizationId}`
		);
		const realEstate = await $axios.get(
			`${dataApi.realEstate}/${+data.realEstateId}`
		);
		let options = {
			loadUrl: `${dataApi.uploadedDocument}/statement/${data.id}`
		};
		store.commit("file-manager/SET_CURRENT_DOCUMENT", JSON.parse(JSON.stringify(data)));
		store.dispatch("file-manager/loadFiles", options);
		return {
			currentData: data,
			organization: organization.data,
			realEstate: realEstate.data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>