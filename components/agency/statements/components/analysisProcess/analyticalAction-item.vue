<template>
	<div class="analytical-action-item">
		<div class="analytical-action-item-buttons">
			<DxFileUploader
				ref="uploader"
				accept="image/*"
				upload-mode="useButtons"
				name="files"
				:multiple="true"
				:upload-url="url"
				:upload-headers="uploaderHeaders"
				:upload-custom-data="uploaderCustomData"
				@uploaded="uploadedFile"
			/>
			<div class="controler-buttons">
				<DxButton
					icon="edit"
					styling-mode="text"
					@click="openAnalyticalActionCard"
				/>
				<DxButton
					icon="trash"
					styling-mode="text"
					type="danger"
					@click="removeAnalyticalAction"
				/>
			</div>
		</div>
		<BasePopup
			:title="$t('labels.analyticalAction')"
			width="40vw"
			ref="analyticalActionCreatePopup"
		>
			<AnalyticalActionCard :data="data" />
		</BasePopup>
		<DxTileView
			:items="files"
			:item-margin="10"
			:base-item-height="150"
			:direction="'vertical'"
			:active-state-enabled="false"
			:focus-state-enabled="false"
			:hover-state-enabled="false"
		>
			<template #item="{data:item}">
				<div>
					<img :src="`data:image/png;base64,${item.thumbnail}`" />
					<div class="card-buttons">
						<DxButton
							@click="downloadFile(item)"
							icon="download"
							styling-mode="contained"
							type="success"
							style="margin:0 10px 0 0"
						/>
						<DxButton
							@click="removeFile(item)"
							icon="trash"
							styling-mode="contained"
							type="danger"
						/>
					</div>
				</div>
			</template>
		</DxTileView>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxAccordion from "devextreme-vue/accordion";
import DxTileView from "devextreme-vue/tile-view";
import DxButton from "devextreme-vue/button";
import { confirm } from "devextreme/ui/dialog";
import { DxFileUploader } from "devextreme-vue/file-uploader";

import BasePopup from "~/components/page/popup.vue";
import AnalyticalActionCard from "./analyticalAction-card.vue";

export default Vue.extend({
	components: {
		DxAccordion,
		DxTileView,
		DxButton,
		DxFileUploader,
		BasePopup,
		AnalyticalActionCard
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			files: []
		};
	},
	computed: {
		url() {
			return `${process.env.SERVER_URL}${this.$dataApi.uploadedDocument}`;
		},
		uploaderHeaders() {
			return {
				Authorization: "Bearer " + this.$store.getters["oidc/oidcAccessToken"]
			};
		},
		uploaderCustomData() {
			return {
				AnalyticalActionId: this.data.id
			};
		}
	},
	methods: {
		openAnalyticalActionCard() {
			this.$refs.analyticalActionCreatePopup.open();
		},
		removeAnalyticalAction() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(
							`${this.$dataApi.analyticalAction}/${this.data.id}`
						),
						e => {
							this.$awn.success();
							this.$emit("successedDeleted");
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			});
		},
		downloadFile(item) {
			this.$store.dispatch("file-manager/downloadFile", {
				context: this,
				loadUrl: `${this.$dataApi.uploadedDocument}/GetFile/${item.fileName}`,
				name: item.fileName
			});
		},
		removeFile(item) {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$store.dispatch("file-manager/removeFile", item.id),
						e => {
							this.$awn.success();
							this.files.forEach((element, index) => {
								if (element.id === item.id) {
									Vue.delete(this.files, index);
								}
							});
							this.$emit("successedDeleted");
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			});
		},
		uploadedFile(e) {
			this.$refs["uploader"].instance.removeFile(e.file);
			let uploadedFile = JSON.parse(e.request.response);
			this.files.push(uploadedFile);
		},
		async getFiles() {
			let { data } = await this.$axios.get(
				`${this.$dataApi.uploadedDocument}/analyticalAction/${this.data.id}`
			);
			this.files = data.data;
		}
	},
	created() {
		this.getFiles();
	}
});
</script>

<style lang="scss">
.analytical-action-item {
	.analytical-action-item-buttons {
		display: flex;
		align-items: center;
		.controler-buttons {
			display: flex;
		}
	}
	.title {
		height: 50px;
	}
	.card-buttons {
		display: flex;
		justify-content: center;
	}
}
</style>