<template>
	<div>
		<DxSelectBox
			ref="selectBox"
			:value-expr="valueExpr"
			:display-expr="displayExpr"
			:data-source="organization"
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
			ref="organizationDataBookEntryPopup"
			width="70vw"
			height="70vh"
			:show-title="true"
			:title="$t('navigation.administration.organizationDataBookEntryTitle')"
		>
			<OrganizationViewTreeList
				:filter="filter"
				:valueExpr="valueExpr"
				@valueSelected="valueSelected"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import OrganizationViewTreeList from "~/components/administration/organization/organization-select-box/organization-view-tree-list.vue";

export default Vue.extend({
	components: {
		OrganizationViewTreeList,
		DxSelectBox,
		BasePopup
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
			organization: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: this.$dataApi.organization
				}),
				filter: this.filter
			}),
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
					name: "list",
					options: {
						icon: "bulletlist",
						stylingMode: "text",
						visible: !this.readOnly,
						onClick: () => {
							this.$refs["organizationDataBookEntryPopup"].open();
						}
					}
				}
			];
		}
	},
	methods: {
		async valueSelected(data) {
			this.$refs["organizationDataBookEntryPopup"].close();
			await this.organization.reload();
			this.$refs["selectBox"].instance.repaint();
			this.$emit("valueChanged", data);
		},
		valueChanged(e) {
			this.$emit("valueChanged", e.value);
		}
	}
});
</script>