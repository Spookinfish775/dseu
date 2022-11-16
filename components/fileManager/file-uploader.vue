<template>
	<div id="file-uploader">
		<DxSelectBox
			:items="officialDocuments"
			display-expr="fullInformation"
			value-expr="id"
			:value.sync="officialDocument"
			:show-clear-button="true"
			item-template="item"
		>
			<template #item="{ data }">
				<div>
					<p :title="data.fullInformation">{{ data.fullInformation }}</p>
				</div>
			</template>
		</DxSelectBox>
		<div class="d-flex align-center">
			<DxFileUploader
				ref="uploader"
				accept="image/*"
				upload-mode="useButtons"
				name="files"
				:value.sync="files"
				:multiple="true"
				:upload-url="url"
				:upload-headers="uploaderHeaders"
				:upload-custom-data="uploaderCustomData"
				:disabled="officialDocument === null"
				@uploaded="uploadedFile"
			/>
			<DxButton
				height="40"
				icon="/icons/scanner/scanner.svg"
				:text="$t(`buttons.scanner`)"
				:disabled="officialDocument === null"
				@click="openScannerDialog"
			/>
		</div>
		<ScannerDialog ref="scannerDialog" @valueChanged="uploadFromScanner" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxFileUploader } from "devextreme-vue/file-uploader";
import DxSelectBox from "devextreme-vue/select-box";
import DxButton from "devextreme-vue/button";
import { base64toBlob } from "~/infrastructure/services/documentVersionService.js";
import ScannerDialog from "~/components/scanner/scaner-dialog-popup.vue";

export default Vue.extend({
	components: {
		DxFileUploader,
		DxSelectBox,
		DxButton,
		ScannerDialog
	},
	props: {
		officialDocumentId: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			officialDocument: this.officialDocumentId,
			files: []
		};
	},
	computed: {
		url() {
			return `${process.env.SERVER_URL}${this.$dataApi.uploadedDocument}`;
		},
		officialDocuments() {
			return this.$store.getters["file-manager/currentDocument"]
				.acceptedDocuments;
		},
		uploaderHeaders() {
			return {
				Authorization: "Bearer " + this.$store.getters["oidc/oidcAccessToken"]
			};
		},
		uploaderCustomData() {
			return {
				OfficialDocumentId: this.officialDocument
			};
		},
		file() {
			return this.$store.getters["scanner/file"];
		}
	},
	methods: {
		uploadFromScanner() {
			const blob = base64toBlob(this.file, "application/pdf");
			var file = new File([blob], `${this.officialDocument}.pdf`, {
				type: "application/pdf"
			});
			this.files.push(file);
		},
		openScannerDialog() {
			this.$refs.scannerDialog.open();
		},
		uploadedFile(e) {
			this.$refs["uploader"].instance.removeFile(e.file);
			let uploadedFile = JSON.parse(e.request.response);
			this.$store.commit("file-manager/ADD_UPLOADED_FILE", uploadedFile);
		}
	}
});
</script>

<style lang="scss">
#file-uploader {
	padding: 10px 0 0 0;
}
</style>