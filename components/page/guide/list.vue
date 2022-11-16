<template>
	<ul class="guide-list">
		<li v-for="(item, index) in items" :key="index">
			<div v-if="item.visible" class="guide-list-info">
				<img
					v-if="item.icon"
					:src="`/icons/navigation/${item.icon}`"
					:alt="item.name"
				/>
				<div>
					<nuxt-link no-prefetch :to="item.path" class="guide-list-title">
						<h3>{{ $t(item.title) }}</h3>
					</nuxt-link>
					<p>{{ $t(item.description) }}</p>
				</div>
			</div>
			<ul class="guide-sub-list">
				<li  v-for="(subItem, subIndex) in item.items"  :key="subIndex">
					<nuxt-link v-if="subItem.visible" no-prefetch :to="subItem.path">
						<h4>{{ $t(subItem.title) }}</h4>
						<p>{{ $t(subItem.description) }}</p>
					</nuxt-link>
				</li>
			</ul>
		</li>
	</ul>
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
.guide-list {
	padding: 20px 0;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: flex;
	grid-gap: 10px;
	@include max($phones) {
		grid-template-columns: repeat(1, 1fr);
	}
	.guide-list-info {
		display: flex;
		align-items: center;
		img {
			width: 30px;
			margin: 0 10px 0 0;
		}
		.guide-list-title {
			cursor: pointer;
			transition: 0.3s;
			display: inline-block;
			&:hover {
				color: $custom-text-color;
			}
		}
		p {
			font-size: 12px;
		}
	}

	.guide-sub-list {
		margin: 0 0 0 40px;
		li {
			transition: 0.3s;
			cursor: pointer;
			margin: 5px;
			a {
				display: block;
				padding: 5px 10px;
				width: 100%;
				height: 100%;
			}
			&:hover {
				background-color: $custom-list-hover-bgcolor;
			}
		}
	}
}
</style>
