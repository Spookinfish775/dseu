<template>
	<DxTabPanel :data-source="items">
		<template #title="{ data: item }">
			<span>{{ item.title }}</span>
		</template>
		<template #item="{ data: item }">
			<div style="padding: 20px">
				<component
					:registrationStatementId="data.id"
					:is="item.component"
					:data="item.itemData"
					:readOnly="item.readOnly"
				/>
			</div>
		</template>
	</DxTabPanel>
</template>

<script lang="ts">
import Vue from "vue";
import DxTabPanel from "devextreme-vue/tab-panel";

import Card from "./base-card.vue";
import RegistrationStatementCard from "~/components/agency/statements/registrationStatement/card.vue";

export default Vue.extend({
	components: {
		DxTabPanel,
		Card,
		RegistrationStatementCard,
		CaseDataGrid: () => import("~/components/case/data-grid.vue")
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		readOnly: {
			type: Boolean,
			default: false
		},
		currentStatement: {
			type: Object,
			required: true
		}
	},
	computed: {
		items() {
			return [
				{
					title: this.$t("labels.registrationServiceCard.card"),
					component: "Card",
					readOnly: this.readOnly,
					itemData: this.data
				},
				{
					title: this.$t(
						"labels.registrationServiceCard.registrationServiceCard"
					),
					component: "RegistrationStatementCard",
					readOnly: true,
					itemData: this.currentStatement
				},
				{
					title: this.$t("labels.registrationServiceCard.caseDataGrid"),
					component: "CaseDataGrid",
					readOnly: true,
					itemData: this.currentStatement
				}
			];
		}
	}
});
</script>