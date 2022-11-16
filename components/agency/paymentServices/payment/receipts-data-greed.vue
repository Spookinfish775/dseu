<template>
	<DxDataGrid
		height="40vh"
		:data-source="receipts"
		:show-borders="true"
		:hoverStateEnabled="true"
		:errorRowEnabled="false"
		:remote-operations="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:column-auto-width="true"
		:load-panel="{
			enabled: true,
			indicatorSrc: require('~/static/icons/loading.gif')
		}"
		@saved="savedReceipts"
	>
		<DxEditing
			:allow-adding="true"
			:allow-updating="true"
			:allow-deleting="true"
			:useIcons="true"
			mode="row"
		/>

		<DxColumn
			data-field="number"
			data-type="string"
			:caption="$t('labels.number')"
		>
			<DxRequiredRule :message="$t('notifications.required.number')" />
		</DxColumn>
		<DxColumn data-field="sum" data-type="number" :caption="$t('labels.sum')">
			<DxRequiredRule :message="$t('notifications.required.sum')" />
		</DxColumn>
	</DxDataGrid>
</template>

<script>
import {
	DxDataGrid,
	DxColumn,
	DxEditing,
	DxRequiredRule,
	DxSearchPanel
} from "devextreme-vue/data-grid";

export default {
	components: {
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxRequiredRule,
		DxSearchPanel
	},
	props: {
		data: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			receipts: this.data
		};
	},
	methods: {
		savedReceipts() {
			this.receipts.forEach(receipts => {
				delete receipts["__KEY__"];
			});
			this.$emit("valueChanged", this.receipts);
		}
	}
};
</script>

<style lang="scss">
</style>
