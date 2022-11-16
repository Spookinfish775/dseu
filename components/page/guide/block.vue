<template>
	<div class="home-page-wrapper">
		<nuxt-link
			v-for="(item, index) in items"
			:key="index"
			:to="item.path"
			class="navigation-block"
			no-prefetch
		>
			<img :src="`/icons/navigation/${item.icon}`" :alt="item.name" />
			<h3>{{ $t(item.title) }}</h3>
		</nuxt-link>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	props: {
		items: {
			type: Array,
			required: true
		}
	}
});
</script>

<style lang="scss">
.home-page-wrapper {
	display: grid;
	grid-gap: 10px;
	align-items: center;
	justify-items: center;
	grid-template-columns: repeat(4, 1fr);

	@include minmax($desktops, $large-desktops) {
		grid-template-columns: repeat(3, 1fr);
	}
	@include minmax($phones, $desktops) {
		grid-template-columns: repeat(2, 1fr);
	}
	@include max($phones) {
		grid-template-columns: repeat(1, 1fr);
	}
	.navigation-block {
		width: 300px;
		height: 300px;
		transition: 0.3s;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		@include max($phones) {
			width: 200px;
			height: 200px;
		}
		img {
			width: 100px;
		}
		&:hover {
			background-color: #ddd;
		}
	}
}
</style>
