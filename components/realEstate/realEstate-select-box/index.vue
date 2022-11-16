<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="realEstate"
			:value="value"
			:buttons="buttons"
			:read-only="readOnly"
			:showClearButton="true"
			:search-enabled="true"
			:search-expr="[displayExpr, 'conventionalNumber', 'invertarNumber']"
			:open-on-field-click="false"
			@value-changed="valueChanged"
			item-template="selectBoxItem"
			field-template="selectedField"
		>
			<template #selectedField="{ data }">
				<div>
					<div
						v-if="data"
						:class="EncumbranceProcessType[data.encumbranceProcessType]"
					>
						<DxTextBox :value="data.address" />
					</div>
					<div v-else>
						<DxTextBox />
					</div>
				</div>
			</template>
			<template #selectBoxItem="{ data }">
				<div
					:class="EncumbranceProcessType[data.encumbranceProcessType]"
					:title="data.address"
				>
					<p>
						<b>{{ $t("labels.address") }}:</b>
						{{ data.address }}
					</p>
					<p>
						<b>{{ $t("labels.conventionalNumber") }}:</b>
						{{ data.conventionalNumber }}
					</p>
					<p>
						<b>{{ $t("labels.invertarNumber") }}:</b>
						{{ data.invertarNumber }}
					</p>
				</div>
			</template>
		</DxSelectBox>

		<BasePopup
			ref="realEstateGreedPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('navigation.realEstate.title')"
		>
			<RealEstateViewDataGreed
				:valueExpr="valueExpr"
				@valueSelected="valueSelected"
			/>
		</BasePopup>
		<BasePopup
			ref="realEstatePopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="popupTitle"
		>
			<RealEstateCard
				v-if="isCard"
				:data="selectedValue"
				:readOnly="readOnly"
				@successedSaved="successedSaved"
				@successedDeleted="successedDeleted"
			/>
			<RealEstateCreate v-else @successedSaved="successedSaved" />
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import { DxScrollView } from "devextreme-vue/scroll-view";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import RealEstateViewDataGreed from "~/components/realEstate/realEstate-select-box/realEstate-view-data-greed.vue";
import RealEstateCreate from "~/components/realEstate/realEstate-create.vue";
import RealEstateCard from "~/components/realEstate/realEstate-card.vue";

import { EncumbranceProcessType } from "~/infrastructure/enums/EncumbranceProcessType";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

import { DxTextBox } from "devextreme-vue/text-box";

export default Vue.extend({
	components: {
		RealEstateViewDataGreed,
		RealEstateCreate,
		RealEstateCard,
		DxSelectBox,
		BasePopup,
		DxScrollView,
		DxTextBox
	},
	props: {
		value: {
			default: null
		},
		valueExpr: {
			type: String,
			default: "id"
		},
		displayExpr: {
			type: String,
			default: "address"
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isCard: false,
			realEstate: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.realEstate
				})
			}),
			selectedValue: null,
			EncumbranceProcessType
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["RealEstate"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["RealEstate"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["RealEstate"];
			return PermissionControler.fullAccess(permission);
		},
		popupTitle() {
			return this.isCard
				? this.$t("navigation.realEstate.title")
				: this.$t("navigation.realEstate.createRealEstateTitle");
		},
		buttons() {
			return [
				{
					location: "after",
					name: "clear"
				},
				{
					location: "after",
					name: "info",
					options: {
						icon: "info",
						stylingMode: "text",
						disabled: this.value === null,
						visible: this.value !== null,
						onClick: () => {
							if (this.valueExpr == "id") {
								this.$awn.asyncBlock(
									this.$axios.get(`${this.$dataApi.realEstate}/${this.value}`),
									e => {
										this.selectedValue = e.data;
										this.isCard = true;
										this.$refs["realEstatePopup"].open();
									},
									e => {
										this.$awn.alert();
									}
								);
							}
						}
					}
				},
				{
					location: "after",
					name: "add",
					options: {
						icon: "plus",
						stylingMode: "text",
						visible: this.canCreate && !this.readOnly,
						onClick: () => {
							this.isCard = false;
							this.$refs["realEstatePopup"].open();
						}
					}
				},
				{
					location: "after",
					name: "list",
					options: {
						icon: "bulletlist",
						stylingMode: "text",
						visible: !this.readOnly,
						onClick: () => {
							this.$refs["realEstateGreedPopup"].open();
						}
					}
				}
			];
		}
	},
	methods: {
		async successedSaved(data) {
			this.$refs["realEstatePopup"].close();
			await this.realEstate.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data[this.valueExpr]);
		},
		async successedDeleted() {
			this.$refs["realEstatePopup"].close();
			await this.realEstate.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", null);
		},
		async valueSelected(data) {
			this.$refs["realEstateGreedPopup"].close();
			await this.realEstate.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data);
		},
		valueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>

<style lang="scss">
.EncumbranceLetter {
	background-color: yellow;
	color: black;
}
.Forced {
	background-color: red;
	color: white !important;
}
.Voluntary {
	background-color: pink;
}
</style>
