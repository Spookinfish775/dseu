<template>
	<div id="mobile_navigation_menu_list">
		<DxList :items="items" @item-click="handleItemClick">
			<template #item="{ data }">
				<ListMenuItem :data="data" />
			</template>
		</DxList>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import DxTreeView from "devextreme-vue/ui/tree-view";
import { DxList } from "devextreme-vue/list";

import ListMenuItem from "./list-menu-item.vue";

export default Vue.extend({
	components: {
		DxTreeView,
		DxList,
		ListMenuItem
	},
	computed: {
		items(): object[] {
			return this.$store.getters["menu/items"];
		}
	},
	methods: {
		handleItemClick(e: any) {
			this.$router.push(e.itemData.path);
		}
	}
});
</script>

<style lang="scss">
#mobile_navigation_menu_list {
	width: 100%;
	height: 80vh;
	padding: 10px;
}
</style>
