<template>
	<div class="found-item">
		<ul v-for="(item, name) in data" :key="name">
			<li>
				{{ $t(`elasticSearch.${name}`) }} :
				<span v-for="(value, index) in item" :key="index">
					<p class="item" v-html="value" />
				</span>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	methods: {
		removeKeyword() {
			let a = this.data;
			for (const key in a) {
				let index = key.indexOf("keyword");
				if (index != -1) {
					delete a[key];
				}
			}
		}
	},
	created() {
		this.removeKeyword();
	}
});
</script>

<style lang="scss">
.found-item {
	.item {
		display: inline-block;
		span {
			background-color: yellow;
		}
	}
}
</style>