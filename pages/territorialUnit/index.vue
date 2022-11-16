<template>
	<div>
		<PageHeader :title="pageTitle" :description="pageDescription" />
		<TerritorialUnitTreeList />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import TerritorialUnitTreeList from "~/components/territorialUnit/territorialUnit-tree-list.vue";

export default Vue.extend({
	middleware: ["territorialUnit/index"],
	components: {
		PageHeader,
		TerritorialUnitTreeList
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("territorialUnit");
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
