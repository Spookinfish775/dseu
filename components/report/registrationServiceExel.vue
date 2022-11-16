<template>
	<div class="report-download-form">
		<DxForm ref="form" :form-data.sync="formData">
      <DxGroupItem>
        <DxSimpleItem
          data-field="organizationId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="organizationSelectBox"
        >
          <DxLabel :text="$t('labels.organization')"/>
        </DxSimpleItem>
      </DxGroupItem>
			<DxGroupItem :col-count="2">
				<DxSimpleItem
					data-field="startDate"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="dateBoxOptions"
				>
					<DxLabel :text="$t('navigation.reports.reportTable.startDate')" />
					<DxRequiredRule />
				</DxSimpleItem>

				<DxSimpleItem
					data-field="endDate"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="dateBoxOptions"
				>
					<DxLabel :text="$t('navigation.reports.reportTable.endDate')" />
					<DxRequiredRule />
				</DxSimpleItem>
			</DxGroupItem>
			<DxButtonItem
				:button-options="downloadButtonOptions"
				horizontal-alignment="right"
			/>
		</DxForm>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";

import DxForm, {
	DxGroupItem,
	DxSimpleItem,
	DxLabel,
	DxRequiredRule,
	DxButtonItem
} from "devextreme-vue/form";
import moment from "moment";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxButtonItem,
		BaseToolbar
	},
	data() {
		moment.locale('en');
		return {
			requestUrl: null,
			formData: {
				startDate: moment(new Date()).format("L").replaceAll("/", "."),
				endDate: moment(new Date()).format("L").replaceAll("/", ".")
			}
		};
	},
	computed: {
		dateBoxOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "MM.dd.yyyy"
			});
		},
		downloadButtonOptions() {
			return {
				text: this.$t("buttons.download"),
				onClick: () => {
					this.onDownload();
				}
			};
		},
    organizationSelectBox(){
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.organization + "/userOrganizations",
        displayExpr: "name"
      })
    }
	},
	methods: {
		async onDownload() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				console.log("this.requestUrl", this.requestUrl);

				this.$awn.asyncBlock(
					DocumentLoader.load(this, {
						loadUrl: `${this.$dataApi.reportTable.getExcelFile}?organizationId=${this.formData.organizationId}&startDate=${this.formData.startDate}&endDate=${this.formData.endDate}`,
						name: `${this.$t("labels.reportHeader")}.xlsx`
					}),
					e => {
						this.$awn.success();
					},
					e => {
						this.$awn.alert();
					}
				);
			}
		}
	}
});
</script>

<style lang="scss">
.report-download-form {
	margin-top: 20px;
}
</style>
