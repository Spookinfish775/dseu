<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="dataSource"
			:value="value"
			:buttons="buttons"
			:read-only="readOnly"
			:showClearButton="true"
			:search-enabled="true"
			:search-expr="displayExpr"
			:open-on-field-click="false"
			@value-changed="valueChanged"
		/>
		<BasePopup
			ref="cardPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.letterSenderOrganization')"
			:drag-enabled="false"
			:close-on-outside-click="true"
		>
			<ApplicantCard :data="selectedValue" :readOnly="true" />
		</BasePopup>
		<BasePopup
			ref="viewDataGridPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('labels.letterSenderOrganization')"
			:drag-enabled="false"
			:close-on-outside-click="true"
		>
			<ApplicantsViewDataGreed
				:filter="filter"
				@valueSelected="valueSelected"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import BasePopup from "~/components/page/popup.vue";
import DataSource from "devextreme/data/data_source";

import ApplicantCard from "../applicant-card.vue";

import ApplicantsViewDataGreed from "~/components/agency/statements/components/applicants/applicant-list/applicants-view-data-grid.vue";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";

export default Vue.extend({
	components: {
		DxSelectBox,
		BasePopup,
		ApplicantsViewDataGreed,
		ApplicantCard
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
			default: "name"
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
	data() {
		return {
			dataSource: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.applicant
				}),
				filter: this.filter
			}),
			applicantType: null,
			selectedValue: null
		};
	},
	computed: {
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
									this.$axios.get(`${this.$dataApi.applicant}/${this.value}`),
									e => {
										this.applicantType = ApplicantType[e.data.applicantType];
										this.selectedValue = e.data;
										this.$refs.cardPopup.open();
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
					name: "list",
					options: {
						icon: "bulletlist",
						stylingMode: "text",
						visible: !this.readOnly,
						onClick: () => {
							this.$refs.viewDataGridPopup.open();
						}
					}
				}
			];
		}
	},
	methods: {
		async valueSelected(data) {
			this.$refs.viewDataGridPopup.close();
			await this.dataSource.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data[this.valueExpr]);
		},
		valueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>
