<template>
	<div class="dx-viewport" id="root">
		<DxDrawer
			id="navigation-menu-drawer"
			opened-state-mode="shrink"
			:position="drawerPosition"
			reveal-mode="slide"
			template="navigation-list"
			:opened="isActive"
			:close-on-outside-click="false"
		>
			<template #navigation-list>
				<div>
					<UserPanel />
					<MobileListMenu v-if="$isMobile" />
					<ListMenu v-else />
				</div>
			</template>
			<HeaderToolbar @toggleMenu="toggleMenu" />
			<div id="main-content">
				<transition name="route">
					<nuxt />
				</transition>
				<FileManager />
				<div class="space-block" />
			</div>
		</DxDrawer>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxDrawer from "devextreme-vue/drawer";
import HeaderToolbar from "~/components/layout/header-toolbar.vue";
import ListMenu from "~/components/layout/list-menu.vue";
import MobileListMenu from "~/components/layout/mobile-list-menu.vue";
import UserPanel from "~/components/layout/user-panel.vue";
import FileManager from "~/components/fileManager/index.vue";

import { locale, loadMessages } from "devextreme/localization";
import tkMessages from "~/lang/devExtreme-localization/tk.json";

export default Vue.extend({
	components: {
		DxDrawer,
		UserPanel,
		ListMenu,
		MobileListMenu,
		HeaderToolbar,
		FileManager
	},
	data() {
		let isActive: boolean = true;
		return {
			isActive
		};
	},
	computed: {
		drawerPosition() {
			return this.$isMobile ? "bottom" : "left";
		}
	},
	watch: {
		$route() {
			if (this.$isMobile) {
				this.isActive = false;
			}
		}
	},
	methods: {
		toggleMenu(): void {
			this.isActive = !this.isActive;
		},
		setLocale() {
			loadMessages(tkMessages);
			locale(this.$i18n.locale);
			Intl.DateTimeFormat(this.$i18n.locale);
		}
	},
	created() {
		this.setLocale();
	},
});
</script>

<style lang="scss">
#root {
	width: 100%;
	height: 100vh;
}

#navigation-menu-drawer {
	.dx-drawer-panel-content {
		background-color: $bg-color;
		overflow-y: scroll;
	}

	#main-content {
		width: 100%;
		height: 100%;
		padding: 10px 40px;
		position: relative;
		overflow-y: scroll;
		.space-block {
			display: block;
			height: 100px;
		}
		@include max($tablets) {
			padding: 15px 20px;
		}
		.route-enter-active,
		.route-leave-active {
			transition: opacity 0.6s;
		}
		.route-enter,
		.route-leave-to {
			opacity: 0;
		}
	}
}
</style>
