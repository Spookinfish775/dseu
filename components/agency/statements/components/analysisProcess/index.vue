<template>
	<div class="analysis-process-wrapper">
		<div class="title">
			<span>
				{{ `${$t("labels.startDate")}: ${fomateDate(data.startDate)}` }}
			</span>
			<span v-if="data.endDate">{{
				`${$t("labels.endDate")}:  ${fomateDate(data.endDate)}`
			}}</span>
		</div>
		<h3>{{ $t("labels.analyticalAction") }}:</h3>

		<div class="list-item-toolbar">
			<DxButton
				icon="plus"
				styling-mode="text"
				@click="openAnalyticalActionCreate"
			/>
		</div>

		<DxScrollView width="100%" height="47vh" :use-native="true">
			<div style="margin:0 0 20px 0">
				<DxAccordion
					ref="actionAccordion"
					:collapsible="true"
					:data-source="analyticalAction"
					:active-state-enabled="false"
					:focus-state-enabled="false"
					:hover-state-enabled="false"
				>
					<template #title="{ data :item }">
						<div>
							<p>
								<b>{{ $t("labels.name") }}:</b>
								{{ item.name }}
							</p>
							<p>
								<b>{{ $t("labels.description") }}:</b>
								{{ item.description }}
							</p>
						</div>
					</template>
					<template #item="{ data :item }">
						<AnalysisProcessListItem
							:data="item"
							@successedDeleted="successedDeletedAction"
						/>
					</template>
				</DxAccordion>
			</div>
		</DxScrollView>

		<BasePopup
			:title="$t('labels.analyticalAction')"
			width="40vw"
			ref="analyticalActionCreatePopup"
		>
			<AnalyticalActionCreate
				:analysisProcessId="data.id"
				@successedSaved="analyticalActionSaved"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxList from "devextreme-vue/list";
import DxAccordion from "devextreme-vue/accordion";
import DxButton from "devextreme-vue/button";
import DataSource from "devextreme/data/data_source";
import { DxScrollView } from "devextreme-vue/scroll-view";

import BasePopup from "~/components/page/popup.vue";
import AnalyticalActionCreate from "./analyticalAction-create.vue";
import AnalysisProcessListItem from "./analyticalAction-item.vue";

import moment from "moment";

export default Vue.extend({
	components: {
		DxList,
		DxAccordion,
		DxScrollView,
		DxButton,
		BasePopup,
		AnalyticalActionCreate,
		AnalysisProcessListItem
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			analyticalAction: new DataSource({
				store: this.$dxStore({
					key: "id",
					loadUrl: `${this.$dataApi.analyticalAction}/analysisProcess/${this.data.id}`,
					removeUrl: this.$dataApi.analyticalAction
				})
			})
		};
	},

	methods: {
		fomateDate(value) {
			moment.locale(this.$i18n.locale);
			return moment(value).format("LL");
		},
		successedDeletedAction() {
			this.analyticalAction.reload();
		},
		openAnalyticalActionCreate() {
			this.$refs.analyticalActionCreatePopup.open();
		},
		analyticalActionSaved() {
			this.$refs.analyticalActionCreatePopup.close();
			this.analyticalAction.reload();
		}
	}
});
</script>


<style lang="scss">
.analysis-process-wrapper {
	.list-item-toolbar {
		margin: 10px 0;
	}

	.list-item-toolbar {
		display: flex;
		justify-content: flex-end;
	}
}
</style>