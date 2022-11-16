<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<RealEstateCard
			:data="currentRealEstate"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RealEstateCard from "~/components/realEstate/realEstate-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	middleware: ["territorialUnit/index"],
	components: {
		PageHeader,
		RealEstateCard
	},
	data() {
		return {
			currentRealEstate: null
		};
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("realEstate");
		},
		pageTitle() {
			let title: string = `${this.$t(this.block.title)}: ${
				this.currentRealEstate.address
			}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(`${dataApi.realEstate}/${+params.id}`);
		return {
			currentRealEstate: data
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
