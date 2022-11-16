<template>
	<div v-if="popupVisible">
		<DxPopup
			width="80vw"
			height="80vh"
			position="center"
			:show-title="true"
			:drag-enabled="false"
			:close-on-outside-click="false"
			:visible.sync="popupVisible"
		>
			<DxScrollView width="100%" height="80vh" :use-native="true">
				<div style="margin:0 0 20px 0">
					<DocumentEditor :data="data" />
				</div>
			</DxScrollView>
		</DxPopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxPopup } from "devextreme-vue/popup";
import { DxScrollView } from "devextreme-vue/scroll-view";

import DocumentEditor from "./index.vue";

export default Vue.extend({
	components: {
		DxPopup,
		DxScrollView,
		DocumentEditor
	},
	props: {
		data: {
			type: String,
			default: ""
		},
		visible: {
			type: Boolean,
			default: false
		}
	},
	model: {
		prop: "visible",
		event: "changePopupVisible"
	},
	computed: {
		popupVisible: {
			get() {
				return this.visible;
			},
			set(val) {
				this.$emit("changePopupVisible", val);
			}
		}
	}
});
</script>