<template>
	<div>
		<PageHeader :showBackBtn="true" :title="pageTitle" />
		<TerritorialUnitCard
			:data="currentTerritorialUnit"
			@successedDeleted="successedDeleted"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import TerritorialUnitCard from "~/components/territorialUnit/territorialUnit-card.vue";
import { dataApi } from "~/static/dataApi";

export default Vue.extend({
	middleware: ["territorialUnit/index"],
	components: {
		PageHeader,
		TerritorialUnitCard
	},
	data() {
		return {
			currentTerritorialUnit: null
		};
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("territorialUnit");
		},
		pageTitle() {
			let title: string = `${this.$t(this.block.title)}: ${
				this.currentTerritorialUnit.name
			}`;
			return title;
		}
	},
	async asyncData({ $axios, params }) {
		const { data } = await $axios.get(
			`${dataApi.territorialUnit}/${+params.id}`
		);
		return {
			currentTerritorialUnit: data
		};
	},
	methods: {
		successedDeleted() {
			this.$router.go(-1);
		}
	}
});
</script>