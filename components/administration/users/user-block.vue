<template>
	<BasePopup ref="basePopup">
		<div>
			<DxDateBox :value.sync="lockoutEndDate" :disabled="isLockedOut" />
			<div style="margin:30px 0 0 0">
				<DxButton
					icon="close"
					:text="this.$t(`labels.userLock`)"
					:disabled="isLockedOut"
					@click="userLock"
				/>
				<DxButton
					icon="check"
					:text="this.$t(`labels.userUnlock`)"
					:disabled="!isLockedOut"
					@click="userUnlock"
				/>
			</div>
		</div>
	</BasePopup>
</template>

<script>
import BasePopup from "~/components/page/popup.vue";
import DxDateBox from "devextreme-vue/date-box";
import DxButton from "devextreme-vue/button";
import { confirm } from "devextreme/ui/dialog";
export default {
	components: {
		BasePopup,
		DxDateBox,
		DxButton
	},
	props: {
		userId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			lockoutEndDate: null,
			isLockedOut: false
		};
	},
	methods: {
		open() {
			this.$refs.basePopup.open();
		},
		close() {
			this.$refs.basePopup.close();
		},
		async getInfo() {
			let { data } = await this.$axios.get(
				`${this.$dataApi.user}/GetLockInfo/${this.userId}`
			);
			this.lockoutEndDate = data.lockoutEndDate;
			this.isLockedOut = data.isLockedOut;
		},
		userLock() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.post(`${this.$dataApi.user}/Lock`, {
							userId: this.userId,
							until: this.lockoutEndDate
						}),
						e => {
							this.$awn.success();
							this.close();
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			});
		},
		userUnlock() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.post(`${this.$dataApi.user}/Unlock`, {
							userId: this.userId
						}),
						e => {
							this.$awn.success();
							this.close();
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			});
		}
	},
	mounted() {
		this.getInfo();
	}
};
</script>