<template>
	<div>
		<DxButton
			:text="$t('labels.userWorkplace')"
			type="normal"
			styling-mode="contained"
			@click="openList"
		/>
		<BasePopup
			ref="userWorkplacePopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.userWorkplace')"
		>
			<DxToolbar v-if="!readOnly" id="userWorkplace-list-toolbar">
				<DxItem
					:options="createButtonOptions"
					location="after"
					widget="dxButton"
				/>
			</DxToolbar>
			<DxList
				height="30vh"
				:data-source="userWorkplace"
				:allow-item-deleting="!readOnly"
				:read-only="readOnly"
				:use-native-scrolling="true"
				menu-mode="context"
			>
				<template #item="{data}">
					<div>
						<p>
							<b>{{ $t("labels.jobTitle") }}:</b>
							{{ data.jobTitle.name }}
						</p>
						<p>
							<b>{{ $t("labels.organization") }}:</b>
							{{ data.organization.name }}
						</p>
					</div>
				</template>
			</DxList>
		</BasePopup>
		<BasePopup
			ref="userWorkplaceCreatePopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.userWorkplace')"
		>
			<UserWorkplaceCreate
				:userId="userId"
				@successedSaved="successedSavedUserWorkplace"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxButton from "devextreme-vue/button";
import DxList from "devextreme-vue/list";
import DataSource from "devextreme/data/data_source";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";

import BasePopup from "~/components/page/popup.vue";
import UserWorkplaceCreate from "./userWorkplace-create.vue";

export default Vue.extend({
	components: {
		DxButton,
		BasePopup,
		DxList,
		DxToolbar,
		DxItem,
		UserWorkplaceCreate
	},
	props: {
		userId: {
			type: String,
			required: true
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			userWorkplace: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: `${this.$dataApi.userWorkplace}/user/${this.userId}`,
					removeUrl: this.$dataApi.userWorkplace
				})
			})
		};
	},
	computed: {
		createButtonOptions() {
			return {
				icon: "plus",
				type: "normal",
				useSubmitBehavior: true,
				hint: this.$t("buttons.create"),
				onClick: () => {
					this.$refs["userWorkplaceCreatePopup"].open();
				}
			};
		}
	},
	methods: {
		async openList() {
			await this.userWorkplace.reload();
			this.$refs["userWorkplacePopup"].open();
		},
		async successedSavedUserWorkplace() {
			await this.userWorkplace.reload();
			this.$refs["userWorkplaceCreatePopup"].close();
		}
	}
});
</script>

<style >
#userWorkplace-list-toolbar {
	margin: 0 0 10px 0;
}
</style>