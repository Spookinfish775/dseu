<template>
	<div id="territorialUnit-quick-filter">
		<DxSelectBox
			id="region-select-box"
			width="8vw"
			value-expr="id"
			display-expr="name"
			:value.sync="regionId"
			:data-source="regionSource"
			:showClearButton="true"
			:placeholder="$t('territorialUnit.filterByRegion')"
			@valueChanged="regionChanged"
		/>
		<DxSelectBox
			width="10vw"
			value-expr="id"
			display-expr="name"
			:value.sync="districtId"
			:data-source="districtSource"
			:readOnly="regionId === null"
			:showClearButton="true"
			:placeholder="$t('territorialUnit.filterByDistrict')"
			@valueChanged="districtChanged"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

export default Vue.extend({
	components: {
		DxSelectBox
	},
	props: {
		defaultRegionId: {
			type: Number,
			default: null
		},
		defaultDistrictId: {
			type: Number,
			default: null
		},
		storeKey: {
			type: String,
			default: "TerritorialUnitFilter"
		}
	},
	data() {
		return {
			regionId: localStorage.hasOwnProperty(
				`${this.storeKey}-filter-regionId`
			)
				? +localStorage.getItem(`${this.storeKey}-filter-regionId`)
				: this.defaultRegionId,
			districtId: localStorage.hasOwnProperty(
				`${this.storeKey}-filter-districtId`
			)
				? +localStorage.getItem(`${this.storeKey}-filter-districtId`)
				: this.defaultDistrictId
		};
	},
	computed: {
		regionSource() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.region
				}),
				pageSize: 15
			});
		},
		districtSource() {
			return new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.district
				}),
				filter: ["regionId", "=", this.regionId],
				pageSize: 15
			});
		},
		filter() {
			const filter: any[] = [];
			if (typeof this.regionId === "number") {
				filter.push(["regionId", "=", this.regionId]);
			}
			if (typeof this.districtId === "number") {
				filter.push(["districtId", "=", this.districtId]);
			}
			if (filter.length > 0) return filter;
		}
	},
	watch: {
		filter(value) {
			this.$emit("valueChanged", value);
		}
	},
	methods: {
		regionChanged({ value }) {
			this.districtId = null;
			if (typeof value === "number") {
				localStorage.setItem(
					`${this.storeKey}-filter-regionId`,
					value.toString()
				);
			} else {
				localStorage.removeItem(`${this.storeKey}-filter-regionId`);
			}
		},
		districtChanged({ value }) {
			if (typeof value === "number") {
				localStorage.setItem(
					`${this.storeKey}-filter-districtId`,
					value.toString()
				);
			} else {
				localStorage.removeItem(`${this.storeKey}-filter-districtId`);
			}
		}
	},
	created() {
		this.$emit("valueChanged", this.filter);
	}
});
</script>

<style lang="scss">
#territorialUnit-quick-filter {
	display: flex;
	justify-content: flex-end;
	#region-select-box {
		margin: 0 5px 0 0;
	}
}
</style>
