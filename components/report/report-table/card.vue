<template>
  <div class="report-download-form">
    <!-- <BaseToolbar :canDownload="true" @download="onDownload" /> -->
    <DxForm ref="form" :form-data.sync="formData">
      <DxGroupItem :caption="$t('labels.reportHeader')">
        <DxSimpleItem
          data-field="organizationId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="organizationSelectBox"
        >
          <DxLabel :text="$t('labels.organization')"/>
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="reportType"
          data-type="string"
          editor-type="dxSelectBox"
          :editor-options="reportOptions"
        >
          <DxLabel :text="$t('labels.type')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="reportSubType"
          data-type="string"
          editor-type="dxSelectBox"
          :editor-options="typeOptions"
          :visible="
            typeData === ReportTable.Type01 ||
            typeData === ReportTable.Type02 ||
            typeData === ReportTable.Type03 ||
            typeData === ReportTable.Type05
          "
        >
          <DxLabel :text="$t('labels.subType')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxGroupItem :col-count="2">
          <DxSimpleItem
            data-field="startDate"
            data-type="date"
            editor-type="dxDateBox"
            :editor-options="dateBoxOptions"
          >
            <DxLabel :text="$t('labels.startDate')" />
            <DxRequiredRule />
          </DxSimpleItem>

          <DxSimpleItem
            data-field="endDate"
            data-type="date"
            editor-type="dxDateBox"
            :editor-options="dateBoxOptions"
          >
            <DxLabel :text="$t('labels.endDate')" />
            <DxRequiredRule />
          </DxSimpleItem>
        </DxGroupItem>
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
  DxButtonItem,
} from "devextreme-vue/form";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { ReportTables } from "~/infrastructure/data-sources/ReportTables";
import { ReportTablesSubTypes } from "~/infrastructure/data-sources/ReportTablesSubTypes";
import { ReportTable } from "~/infrastructure/enums/ReportTable";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
    BaseToolbar,
  },
  data() {
    return {
      ReportTable,
      typeData: null,

      requestUrl: null,

      formData: {
        reportType: null,
        reportSubType: null,
        startDate: null,
        endDate: null,
      },
    };
  },
  computed: {
    reportOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: ReportTables(this),
        valueExpr: "this",
        onValueChanged: (e) => {
          this.typeData = e.value.id;
          this.requestUrl = e.value.url;
          this.formData.reportSubType = null;
        },
      });
    },
    typeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: ReportTablesSubTypes(this),
      });
    },
    dateBoxOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "MM.dd.yyyy",
      });
    },
    downloadButtonOptions() {
      return {
        text: this.$t("buttons.download"),
        onClick: () => {
          this.onDownload();
        },
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
        this.$awn.asyncBlock(
          DocumentLoader.load(this, {
            loadUrl: `${this.requestUrl}?organizationId=${this.formData.organizationId}&startDate=${this.formData.startDate}&endDate=${this.formData.endDate}&type=${this.formData.reportSubType}`,
            name: `${this.$t("labels.reportHeader")}.xlsx`,
          }),
          (e) => {
            this.$awn.success();
          },
          (e) => {
            this.$awn.alert();
          }
        );
      }
    },
  },
});
</script>

<style lang="scss">
.report-download-form {
  margin-top: 20px;
}
</style>
