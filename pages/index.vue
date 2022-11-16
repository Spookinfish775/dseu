<template>
	<div>
		<PageGuideBlock :items="items" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import PageGuideBlock from "~/components/page/guide/block.vue";

export default Vue.extend({
	middleware: ["homePage"],
	components: {
		PageGuideBlock
	},
	computed: {
		items(): object[] {
			return this.$store.getters["menu/items"];
		}
	}
});
</script>
