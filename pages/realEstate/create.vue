<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<RealEstateCreate @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import RealEstateCreate from "~/components/realEstate/realEstate-create.vue";

export default Vue.extend({
	middleware: ["territorialUnit/create"],
	components: {
		PageHeader,
		RealEstateCreate
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"](
				"realEstate.createRealEstate"
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
	},
	methods: {
		successedSaved(realEstate) {
			this.$router.replace(`/realEstate/${realEstate.id}`);
		}
	}
});
</script>

<style scoped></style>
