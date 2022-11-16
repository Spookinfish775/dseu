<template>
	<BasePopup :height="`80vh`" :width="`80vw`" ref="basePopup">
		<scanner-dialog
			v-if="connected"
			@closeScanDialog="closeScanDialog"
			@fileSaved="valueChanged"
		/>
	</BasePopup>
</template>

<script lang="ts">
import Vue from "vue";
import { alert } from "devextreme/ui/dialog";

import BasePopup from "~/components/page/popup.vue";
import { ImageService } from "~/infrastructure/services/ImageService";

import scannerDialog from "./index.vue";

export default Vue.extend({
	components: {
		BasePopup,
		scannerDialog
	},
	data() {
		return {
			file: null
		};
	},
	computed: {
		connected() {
			return this.$store.getters["scanner/connected"];
		}
	},
	methods: {
		async open() {
			if (!this.connected) {
				console.log("aaaa");
				await this.connect();
			}
			this.$refs.basePopup.open();
		},
		closeScanDialog() {
			this.$refs.basePopup.close();
			this.$emit("close");
		},
		valueChanged(e) {
			const blob = ImageService.base64toBlob(e.file, "application/pdf");
			this.$emit("valueChanged", { file: blob });
			this.closeScanDialog();
		},
		async connect() {
			let status = await this.$scanner.tryConnect();
			if (!status) {
				alert(
					this.$t("scanner.alert.checkSwichOnScannerApp"),
					this.$t(`scanner.alert.error`)
				);
				this.closeScanDialog();
			} else {
				this.$emit("loadStatus");
				this.$emit("showTitle", this.$t("scanner.header"));
			}
			this.$store.commit("scanner/SET_CONNECTED_STATE", status);
		}
	}
});
</script>