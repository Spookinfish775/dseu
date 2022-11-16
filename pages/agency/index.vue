<template>
	<div>
		<PageHeader :title="pageTitle" :description="pageDescription" />
		<PageGuideList :items="block.items" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import PageGuideList from "~/components/page/guide/list.vue";

export default Vue.extend({
	components: {
		PageHeader,
		PageGuideList
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency");
		},
		pageTitle() {
			let title: string = this.$t(this.block.title);
			return title;
		},
		pageDescription() {
			let description: string = this.$t(this.block.description);
			return description;
		}
	}
});
</script>

<style scoped></style>
