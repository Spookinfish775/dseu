<template>
	<div>
		<DxTextBox
			:show-clear-button="true"
			:value.sync="editorValue"
			:read-only="readOnly"
			:buttons="editorButtons"
			@value-changed="valueChanged"
		/>

		<BasePopup width="70%" height="80vh" ref="realEstateViewDataGreedPopup">
			<RealEstateViewDataGreed
				valueExpr="conventionalNumber"
				@valueSelected="valueSelected"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxTextBox from "devextreme-vue/text-box";
import RealEstateViewDataGreed from "~/components/realEstate/realEstate-select-box/realEstate-view-data-greed.vue";
import BasePopup from "~/components/page/popup.vue";
import { RealEstateType } from "~/infrastructure/enums/RealEstateType";

export default Vue.extend({
	components: {
		DxTextBox,
		RealEstateViewDataGreed,
		BasePopup
	},
	props: {
		value: {
			type: String,
			default: null
		},
		readOnly: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		editorValue: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("valueChanged", value);
			}
		},
		editorButtons() {
			return [
				{
					name: "customClear",
					location: "after",
					options: {
						icon: "clear",
						disabled: false,
						visible: !this.disabled,
						onClick: e => {
							this.valueChanged({ value: "" });
						}
					}
				},
				{
					name: "realEstateGrid",
					location: "after",
					options: {
						icon: "menu",
						disabled: false,
						hint:this.$t('help.conventionalNumber'),
						visible: !this.disabled,
						onClick: () => {
							this.$refs["realEstateViewDataGreedPopup"].open();
						}
					}
				}
			];
		}
	},
	methods: {
		valueSelected(data) {
			this.editorValue = data;
			this.$emit("valueChanged", data);
			this.$refs["realEstateViewDataGreedPopup"].close();
		},
		valueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>
