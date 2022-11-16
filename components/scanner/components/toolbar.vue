<template>
	<DxToolbar>
		<DxItem
			location="before"
			widget="dxButton"
			:disabled="isFilesEmpty"
			:options="btnSaveFileOptions"
		/>
		<DxItem
			location="before"
			widget="dxButton"
			:disabled="!hasActivePage || isFilesEmpty"
			:options="btnRotateLeftOptions"
		/>
		<DxItem
			location="before"
			widget="dxButton"
			:disabled="!hasActivePage || isFilesEmpty"
			:options="btnRotateRightOptions"
		/>
		<DxItem
			location="before"
			widget="dxButton"
			:disabled="!hasActivePage || isFilesEmpty"
			:options="btnOrderUpOptions"
		/>
		<DxItem
			location="before"
			widget="dxButton"
			:disabled="!hasActivePage || isFilesEmpty"
			:options="btnOrderDownOptions"
		/>
		<DxItem
			location="before"
			widget="dxButton"
			:disabled="!hasActivePage || isFilesEmpty"
			:options="btnDeleteOptions"
		/>
	</DxToolbar>
</template>

<script lang="ts">
import Vue from "vue";

import { mapActions, mapGetters } from "vuex";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";

export default Vue.extend({
	components: {
		DxToolbar,
		DxItem
	},
	methods: {
		...mapActions({
			rotatePage: "scanner/rotatePage",
			saveFile: "scanner/saveFile",
			scanDocument: "scanner/scanDocument",
			deletePage: "scanner/deletePage",
			setOrderUp: "scanner/setOrderUp",
			setOrderDown: "scanner/setOrderDown"
		})
	},
	computed: {
		...mapGetters({
			isFilesEmpty: "scanner/isFilesEmpty",
			currentPage: "scanner/currentPage",
			files: "scanner/files"
		}),
		hasActivePage() {
			return this.$store.getters["scanner/currentPageId"] !== null;
		},
		btnSaveFileOptions() {
			return {
				icon: "save",
				text: this.$t("buttons.save"),
				onClick: () => {
					this.saveFile();
					this.$emit("fileSaved");
				}
			};
		},
		btnDeleteOptions() {
			return {
				icon: "trash",
				onClick: () => {
					this.deletePage();
				}
			};
		},
		btnRotateRightOptions() {
			return {
				icon: "/icons/scanner/rotateRight.svg",
				text: this.$t("buttons.rotateRight"),
				onClick: () => {
					this.rotatePage(90);
				}
			};
		},
		btnRotateLeftOptions() {
			return {
				icon: "/icons/scanner/rotateLeft.svg",
				text: this.$t("buttons.rotateLeft"),
				onClick: () => {
					this.rotatePage(-90);
				}
			};
		},
		btnOrderUpOptions() {
			return {
				icon: "/icons/scanner/order-up.svg",
				text: this.$t("buttons.orderUp"),
				disabled: this.currentPage?.order === 1,
				onClick: () => {
					this.setOrderUp();
				}
			};
		},
		btnOrderDownOptions() {
			return {
				icon: "/icons/scanner/order-down.svg",
				text: this.$t("buttons.orderDown"),
				disabled: this.currentPage?.order === this.files.length,
				onClick: () => {
					this.setOrderDown();
				}
			};
		}
	}
});
</script>







