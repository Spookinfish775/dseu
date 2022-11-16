<template>
	<transition name="file-manager">
		<div v-if="openState" id="file-manager-wrapper">
			<div class="header">
				<div class="uploader">
					<DxButton
						@click="closeManager"
						icon="close"
						width="100%"
						styling-mode="text"
					/>
					<FileUploader />
				</div>
			</div>
			<div class="content">
				<div v-for="(file, index) in files" :key="index">
					<FileCard :data="file" />
				</div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import Vue from "vue";

import DxButton from "devextreme-vue/button";

import FileCard from "./file-card.vue";
import FileUploader from "./file-uploader.vue";

export default Vue.extend({
	components: {
		DxButton,
		FileCard,
		FileUploader
	},
	computed: {
		openState() {
			return this.$store.getters["file-manager/openState"];
		},
		files() {
			return this.$store.getters["file-manager/files"];
		},
		route() {
			return this.$route.path;
		}
	},
	watch: {
		route() {
			this.closeManager();
		}
	},
	methods: {
		closeManager(e) {
			this.$store.commit("file-manager/CLOSE_MANAGER");
		}
	}
});
</script>

<style lang="scss">
.file-manager-enter-active,
.file-manager-leave-active {
	transition: 0.4s;
}
.file-manager-enter,
.file-manager-leave-to {
	transform: translateX(100%);
}
#file-manager-wrapper {
	position: absolute;
	top: 0;
	right: 0;
	height: 100vh;
	width: 400px;
	z-index: 500;
	background-color: $bg-color;
	padding: 0 10px 50px 10px;
	overflow-y: scroll;
	.header {
		position: relative;
		width: 100%;
		height: 75px;
		margin: 0 0 80px 0;
		.uploader {
			position: fixed;
			background-color: $bg-color;
			z-index: 500;
		}
	}
}
</style>