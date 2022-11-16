<template>
	<DxTagBox
		:data-source="dataSource"
		:value="value"
		:show-selection-controls="true"
		:display-expr="displayExpr"
		:value-expr="valueExpr"
		:readOnly="readOnly"
		apply-value-mode="useButtons"
		@value-changed="onValueChanged"
	/>
</template>

<script lang="ts">
import Vue from "vue";

import DxTagBox from "devextreme-vue/tag-box";
import DataSource from "devextreme/data/data_source";

export default Vue.extend({
	components: {
		DxTagBox
	},
	props: {
		displayExpr: {
			type: String,
			default: "name"
		},
		valueExpr: {
			type: String,
			default: "id"
		},
		value: {
			type: Array,
			default: () => []
		},
		readOnly: {
			type: Boolean,
			default: false
		},
		filter: {
			type: Array,
			default: null
		}
	},
	computed: {
		dataSource() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.district
				}),
				filter: this.filter
			});
		}
	},
	methods: {
		onValueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>