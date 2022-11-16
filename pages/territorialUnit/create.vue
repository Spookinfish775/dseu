<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<TerritorialUnitCreate
			:options="options"
			@successedSaved="successedSaved"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import TerritorialUnitCreate from "~/components/territorialUnit/territorialUnit-create.vue";

export default Vue.extend({
	middleware: ["territorialUnit/create"],
	components: {
		PageHeader,
		TerritorialUnitCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"territorialUnit.createTerritorialUnit"
			);
		},
		pageTitle() {
			let title: string = this.$t(this.block.title);
			return title;
		},
		pageDescription() {
			let description: string = this.$t(this.block.description);
			return description;
		},
		options() {
			const options: any = {};
			for (const query in this.$route.query) {
				options[query] = +this.$route.query[query];
			}
			return options;
		}
	},
	methods: {
		successedSaved(territorialUnit) {
			this.$router.replace(`/territorialUnit/${territorialUnit.id}`);
		}
	}
});
</script>

<style scoped></style>
