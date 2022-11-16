<template>
	<div id="file-card">
		<img :src="`data:image/png;base64,${data.thumbnail}`" />
		<div class="card-info">
			<p>
				<b>{{ $t("labels.fileName") }}:</b> {{ data.fileName }}
			</p>
			<p>
				<b>{{ $t("labels.number") }}:</b> {{ data.officialDocument.number }}
			</p>
			<p>
				<b>{{ $t("labels.issuer") }}:</b> {{ data.officialDocument.issuer }}
			</p>
		</div>
		<div class="card-buttons">
			<DxButton
				@click="downloadFile"
				icon="download"
				styling-mode="contained"
				type="success"
			/>
			<DxButton
				@click="removeFile"
				icon="trash"
				styling-mode="contained"
				type="danger"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxButton from "devextreme-vue/button";
import { confirm } from "devextreme/ui/dialog";

export default Vue.extend({
	components: {
		DxButton
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {};
	},
	methods: {
		downloadFile(e) {
			this.$store.dispatch("file-manager/downloadFile", {
				context: this,
				loadUrl: `${this.$dataApi.uploadedDocument}/GetFile/${this.data.fileName}`,
				name: this.data.fileName
			});
		},
		removeFile(e) {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$store.dispatch("file-manager/removeFile", this.data.id),
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
		}
	}
});
</script>

<style lang="scss">
#file-card {
	position: relative;
	border: 1px solid $base-border-color;
	display: flex;
	flex-direction: column;
	margin: 10px;
	img {
		width: 100%;
	}
	.card-info {
		margin: 10px 0 10px 0;
	}
}
</style>