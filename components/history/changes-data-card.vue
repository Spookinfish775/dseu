<template>
	<div>
		<div class="changes-data-item">
			<p>
				<span>{{ $t("history.changesData.columnName") }}</span>
			</p>
			<p>
				<span>{{ $t("history.changesData.originalValue") }}</span>
			</p>
			<p>
				<span> {{ $t("history.changesData.newValue") }}</span>
			</p>
		</div>
		<DxList
			:data-source="data"
			:focusStateEnabled="false"
			:activeStateEnabled="false"
			height="50vh"
		>
			<template #item="{data:item}">
				<div>
					<div class="changes-data-item">
						<p>
							<span>
								{{ $t("history.labels." + labelFied(item.ColumnName)) }}
							</span>
						</p>
						<p>
							<span class="red">"{{ item.OriginalValue }}"</span>
						</p>
						<p>
							<span class="green">"{{ item.NewValue }}"</span>
						</p>
					</div>
				</div>
			</template>
		</DxList>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxList from "devextreme-vue/list";

export default Vue.extend({
	components: {
		DxList
	},
	props: {
		data: { type: Array, required: true }
	},
	methods: {
		labelFied(label: string): string {
			return label[0].toLowerCase() + label.slice(1);
		}
	}
});
</script>

<style lang="scss">
.changes-data-item {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	span {
		padding: 0 8px;
	}
	span.red {
		background: red;
		color: white;
	}
	span.green {
		background: green;
		color: white;
	}
}
</style>
