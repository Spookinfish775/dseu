<template>
	<div class="scanner">
		<form @submit.prevent="scanDocument">
			<DxLoadPanel
				:visible.sync="isLoading"
				indicatorSrc="/icons/loading.gif"
			/>

			<Toolbar
				class="toolbar-scanner"
				:documentValidatorName="documentValidatorName"
			/>
			<main class="d-flex">
				<template v-if="!isFilesEmpty">
					<LeftSideBar class="left-side-bar" />
					<CurrentPage class="main" />
				</template>
				<div class="main" v-else>
					<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
						<circle
							cx="50"
							cy="50"
							r="42"
							fill="#F4F4F4"
							fill-opacity="0.5"
						></circle>
						<circle cx="50" cy="50" r="33" fill="#F4F4F4"></circle>
						<path
							d="M20 74C20 73.4477 20.4477 73 21 73H81C81.5523 73 82 73.4477 82 74V79C82 81.2091 80.2091 83 78 83H24C21.7909 83 20 81.2091 20 79V74Z"
							fill="white"
							stroke="#C0CDDC"
							stroke-width="2"
						></path>
						<path
							d="M67 42.8254C67 42.8254 59.7447 35.2302 59.5106 35H46.217C45.6085 35 45 35.5984 45 36.2429V62.8032C45 63.4016 45.6085 64 46.217 64H65.5957C66.2043 64 67 63.2175 67 62.619V42.8254Z"
							fill="white"
						></path>
						<path
							d="M45 62H67C67 63.1046 66.1046 64 65 64H47C45.8954 64 45 63.1046 45 62Z"
							fill="#C0CDDC"
							fill-opacity="0.3"
						></path>
						<rect x="49" y="46" width="14" height="1" fill="#C0CDDC"></rect>
						<rect x="49" y="49" width="14" height="1" fill="#C0CDDC"></rect>
						<rect x="49" y="52" width="14" height="1" fill="#C0CDDC"></rect>
						<rect x="49" y="55" width="10" height="1" fill="#C0CDDC"></rect>
						<path
							d="M67 42.3868C67 42.3868 59.7447 35.2302 59.5106 35H46.217C45.6085 35 45 35.5984 45 36.2429V62.8032C45 63.4016 45.6085 64 46.217 64H65.5957C66.2043 64 67 63.2175 67 62.619V42.3868Z"
							stroke="#C0CDDC"
							stroke-width="2"
							stroke-miterlimit="10"
						></path>
						<path
							d="M61 38L64 41H61V38ZM59 35V43H67L59 35Z"
							fill="#C0CDDC"
						></path>
						<path
							d="M61 67V70M56 67V70M51 67V70"
							stroke="#C0CDDC"
							stroke-width="2"
							stroke-linecap="round"
						></path>
						<path
							d="M20 80H82C82 81.1046 81.1046 82 80 82H22C20.8954 82 20 81.1046 20 80Z"
							fill="#C0CDDC"
							fill-opacity="0.3"
						></path>
						<path
							d="M49.8302 18.366C50.3085 18.6422 50.4724 19.2538 50.1962 19.7321L20.1962 71.6936C19.9201 72.1719 19.3085 72.3357 18.8302 72.0596C16.917 70.955 16.2615 68.5087 17.3661 66.5955L44.3661 19.8301C45.4707 17.917 47.917 17.2615 49.8302 18.366Z"
							fill="white"
							stroke="#C0CDDC"
							stroke-width="2"
						></path>
						<path
							d="M48.0981 17.3652L17.0981 71.0588C16.6198 70.7827 16.456 70.1711 16.7321 69.6928L46.7321 17.7313C47.0083 17.253 47.6199 17.0891 48.0981 17.3652Z"
							fill="#C0CDDC"
							fill-opacity="0.3"
						></path>
						<circle cx="77" cy="76" r="1" fill="#C0CDDC"></circle>
						<circle cx="73" cy="76" r="1" fill="#C0CDDC"></circle>
					</svg>
					{{ $t("scanner.downloadfile") }}
				</div>
				<RightSideBar
					:documentValidatorName="documentValidatorName"
					class="right-side-bar"
				/>
			</main>
		</form>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxLoadPanel } from "devextreme-vue/load-panel";
import { confirm } from "devextreme/ui/dialog";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Toolbar from "./components/toolbar.vue";
import CurrentPage from "./components/current-page.vue";
import LeftSideBar from "./components/left-side-nav-bar.vue";
import RightSideBar from "./components/right-side-nav-bar.vue";

export default Vue.extend({
	components: {
		Toolbar,
		CurrentPage,
		LeftSideBar,
		RightSideBar,
		DxLoadPanel
	},
	data() {
		return {
			documentValidatorName: "scannerParamsFormValidator"
		};
	},
	computed: {
		...mapGetters({
			isFilesEmpty: "scanner/isFilesEmpty",
			isLoading: "scanner/isLoading",
			file: "scanner/file"
		}),
		hasActivePage() {
			return this.$store.getters["scanner/currentPageId"] != null;
		},
		loadingConfirm() {
			return [this.$t("scanner.confirm.loading"), this.$t("shared.areYouSure")];
		},
		notSaveConFirm() {
			return [this.$t("scanner.confirm.notSave"), this.$t("shared.areYouSure")];
		}
	},
	watch: {
		file: function(newValue, oldValue) {
			const test = this.onFileSaved;
			function* fileSaved() {
				yield test(newValue);
			}
			fileSaved().next();
		}
	},
	methods: {
		...mapActions({
			onClose: "scanner/onClose"
		}),
		...mapMutations({
			showLoading: "scanner/SHOW_LOADING",
			closeLoading: "scanner/CLOSE_LOADING"
		}),
		onFileSaved(file) {
			this.$emit("fileSaved", { file });
		},
		scanDocument() {
			this.$store.dispatch("scanner/scanDocument");
			this.showLoading();
			setTimeout(() => {
				this.closeLoading();
			}, 1000 * 60);
		},
		async closeScanDialog() {
			if (!this.isFilesEmpty) {
				let confirmMessage  = this.isLoading
					? this.loadingConfirm
					: this.notSaveConFirm;

				const result = await confirm(confirmMessage[0],confirmMessage[1]);
				if (!result) return;
			}
			this.$emit("closeScanDialog");
		}
	},
	destroyed() {
		this.onClose();
	}
});
</script>

<style lang="scss">
.scanner {
	.left-side-bar {
		overflow-y: scroll;
		overflow-x: hidden;
		width: 20%;
		flex-basis: 20%;
	}
	.main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #f4f4f4;
		overflow: hidden;
		flex-grow: 1;
		flex-basis: 800px;
		min-height: 80vh;
	}
	.filesEmpty {
		width: 80vh;
		height: 80vh;
	}
	.right-side-bar {
		padding-left: 20px;
		width: 25%;
		flex-basis: 25%;
	}
	.toolbar-scanner {
		padding: 5px 0;
	}
}
</style>
