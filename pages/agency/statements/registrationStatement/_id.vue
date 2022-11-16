<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<RegistrationStatementCard
			:data="currentData"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RegistrationStatementCard from "~/components/agency/statements/registrationStatement/card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		RegistrationStatementCard
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"agency.createRegistrationStatement"
			);
		},
		pageTitle(): string {
			let title: string = `${this.organization.name} - ${this.$t(
				this.block.title
			)} №${this.chapterNumber}`;
			return title;
		}
	},
	async asyncData({ $axios, params, store }) {
		const { data } = await $axios.get(
			`${dataApi.statements.registrationStatement}/${+params.id}`
		);
		const organization = await $axios.get(
			`${dataApi.organization}/${+data.organizationId}`
		);
		const chapterNumber = await $axios.get(
			`${dataApi.chapterNumber}/${+data.index}`
		);
		let options = {
			loadUrl: `${dataApi.uploadedDocument}/statement/${data.id}`
		};
		store.commit("file-manager/SET_CURRENT_DOCUMENT", JSON.parse(JSON.stringify(data)));
		store.dispatch("file-manager/loadFiles", options);
		return {
			currentData: data,
			organization: organization.data,
			chapterNumber: chapterNumber.data.number
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>