<template>
	<DxPopup
		width="70vw"
		height="auto"
		:show-title="false"
		:drag-enabled="false"
		:close-on-outside-click="true"
		:visible.sync="visible"
	>
		<DxList
			:data-source="types"
			display-expr="name"
			value-expr="id"
			@item-click="onItemClick"
		/>
	</DxPopup>
</template>

<script lang="ts">
import Vue from "vue";

import { DxPopup } from "devextreme-vue/popup";
import DxList from "devextreme-vue/list";

export default Vue.extend({
	components: {
		DxPopup,
		DxList
	},
	props: {
		types: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			visible: false,
			popupController: { resolve: null, reject: null }
		};
	},
	methods: {
		open() {
			this.visible = true;
			const popupPromise = new Promise((ok, fail) => {
				this.popupController.resolve = ok;
				this.popupController.reject = fail;
			});
			return popupPromise;
		},
		close(data) {
			this.visible = false;
			this.popupController.resolve(data);
		},
		onItemClick(e) {
			this.close(e.itemData);
		}
	}
});
</script>