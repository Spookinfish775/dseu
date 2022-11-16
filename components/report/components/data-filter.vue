<template>
	<div id="reports-data-filter">
		<p
			:title="$t('labels.startDate')"
			class="dx-field-label"
		>
			{{ $t("labels.startDate") }}
		</p>
		<div class="dx-field-value">
			<DxDateBox
				width="100"
				id="filter-data-picker"
				:value="start"
				type="date"
				@valueChanged="startDate"
			/>
		</div>

		<p
			:title="$t('labels.endDate')"
			class="dx-field-label"
		>
			{{ $t("labels.endDate") }}
		</p>
		<div class="dx-field-value">
			<DxDateBox
				width="100"
				type="date"
				:value="end"
				:readOnly="start == null"
				@valueChanged="endDate"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxDateBox from "devextreme-vue/date-box";

export default Vue.extend({
	components: {
		DxDateBox
	},
	data() {
		return {
			start: new Date(),
			end: new Date()
		};
	},
	methods: {
		startDate({ value }) {
			this.$emit("startDateChanged", value);
			this.start = value;
		},
		endDate({ value }) {
			this.$emit("endDateChanged", value);
		}
	}
});
</script>

<style lang="scss">
#reports-data-filter {
	display: flex;
	justify-content: flex-end;
	.dx-field-label {
		// width: 180px;
		padding-right: 0;
		margin: 0 0 0 10px;
	}
	.dx-field-value {
		#filter-data-picker {
			margin: 0 5px 0 0;
		}
	}
}
</style>