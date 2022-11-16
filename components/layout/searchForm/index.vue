<template>
	<div class="search-wrapper">
		<DxTextBox
			:width="width"
			:showClearButton="true"
			:value.sync="searchValue"
			:placeholder="$t('labels.search')"
			valueChangeEvent="input"
			@valueChanged="azaaz"
		/>
		<transition name="searchList">
			<div class="search-list" v-show="hawElements">
				<DxList :data-source="dataSource" :height="200" :width="width" />
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxTextBox from "devextreme-vue/text-box";
import DxList from "devextreme-vue/list";
export default Vue.extend({
	components: {
		DxTextBox,
		DxList
	},
	data() {
		return {
			searchValue: "",
			dataSource: ["1", "2", "3", "4", "5"]
		};
	},
	computed: {
		width() {
			return "50vh";
		},
		hawElements() {
			return this.searchValue === "1";
			// return this.dataSource.length > 0;
		}
	},
	methods: {
		async azaaz(e) {
			let { data } = await this.$axios.get("/api/Search", {
				params: {
					query: e.value
				}
			});
		}
	}
});
</script>

<style lang="scss">
.search-wrapper {
	position: relative;
	.search-list {
		position: absolute;
		left: 0;
		bottom: -203px;
		z-index: 10001;
		background-color: $base-bg;
		border: 1px solid $base-border-color;
	}
	.searchList-enter-active,
	.searchList-leave-active {
		transition: opacity 0.3s;
	}
	.searchList-enter,
	.searchList-leave-to {
		opacity: 0;
	}
}
</style>