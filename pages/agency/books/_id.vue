<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<BooksCard :data="currentValue" @successedDeleted="successedDeleted" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import BooksCard from "~/components/agency/books/books-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	// middleware: ["administration/users/index"],
	components: {
		PageHeader,
		BooksCard
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.books");
		},
		pageTitle(): string {
			let title: string = `${this.$t(this.block.title)}: ${
				this.currentValue.name
			}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.books}/${+params.id}`);
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