<template>
	<div class="page-header">
		<DxButton
			:visible="showBackBtn"
			@click="goBack"
			icon="chevronprev"
			styling-mode="text"
		/>
		<div class="text">
			<h2>{{ title }}</h2>
			<p>{{ description }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxButton from "devextreme-vue/button";

export default Vue.extend({
	components: {
		DxButton
	},
	props: {
		showBackBtn: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: "NO TITLE"
		},
		description: {
			type: String
		}
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		}
	}
});
</script>

<style lang="scss">
.page-header {
	display: flex;
	align-items: center;
	margin: 0 0 10px 0;
	overflow: hidden;
	.text {
		margin: 0 0 0 10px;
		h2 {
			overflow: hidden;
			font-size: 26px !important;
			font-weight: 700;
			max-width: 70vw;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		p {
			margin: 5px 0 0 0;
			font-weight: 500;
			color: $custom-text-color;
		}
	}
}
</style>
