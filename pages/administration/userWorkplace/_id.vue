<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<UserWorkplacerCard
			:data="currentUser"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import UserWorkplacerCard from "~/components/administration/userWorkplace/card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	middleware: ["administration/users/index"],
	components: {
		PageHeader,
		UserWorkplacerCard
	},
	data() {
		return {
			currentUser: null
		};
	},
	computed: {
				block() {
			return this.$store.getters["menu/getBlockByName"]("administration.userWorkplace");
		},
		pageTitle(): string {
			let title: string = `${this.$t(this.block.title)}: ${
				this.currentUser.id
			}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.userWorkplace}/${params.id}`);

		return {
			currentUser: data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>