<template>
	<div>
		<PageHeader
			:showBackBtn="true"
			:title="pageTitle"
			:description="pageDescription"
		/>
		<Create @successedSaved="successedSaved" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import Create from "~/components/agency/services/encumbranceLetter/create.vue";

export default Vue.extend({
	// middleware: ["administration/users/create"],
	components: {
		PageHeader,
		Create
	},
	computed: {
		block() {
			return this.$store.getters["menu/getBlockByName"]("agency.createEncumbranceLetter");
		},
		pageTitle() {
			let title: string = this.$t(this.block.title);
			return title;
		},
		pageDescription() {
			let description: string = this.$t(this.block.description);
			return description;
		}
	},
	methods: {
		successedSaved(value) {
			this.$router.replace(`/agency/services/encumbranceLetter/${value.id}`);
		}
	}
});
</script>