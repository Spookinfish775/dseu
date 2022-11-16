<template>
  <div>
    <BaseToolbar :canSave="true" :canDelete="false" @save="sendBlanks" />
    <DxForm ref="form" label-location="top" :form-data.sync="sendData">
      <DxGroupItem>
        <DxSimpleItem data-field="organizationId" template="organization">
          <DxLabel location="left" :text="$t('labels.organization')" />
          <DxRequiredRule
            :message="$t('notifications.required.organization')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="receiverId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="reciverOptions"
        >
          <DxLabel location="left" :text="$t('labels.receiverId')" />
          <DxRequiredRule :message="$t('notifications.required.receiverId')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="blankId"
          data-type="number"
          editor-type="dxTagBox"
          :editor-options="blanksOptions"
        >
          <DxLabel location="left" :text="$t('labels.blanks')" />
          <DxRequiredRule :message="$t('notifications.required.blankId')" />
        </DxSimpleItem>
        <DxGroupItem :col-count="2" :caption="$t('labels.numberRange')">
          <DxSimpleItem
            editor-type="dxNumberBox"
            :editor-options="numberFromOptions"
          >
            <DxLabel location="left" :text="$t('labels.numberFrom')" />
          </DxSimpleItem>
          <DxSimpleItem
            editor-type="dxNumberBox"
            :editor-options="numberToOptions"
          >
            <DxLabel location="left" :text="$t('labels.numberTo')" />
          </DxSimpleItem>
        </DxGroupItem>
      </DxGroupItem>
      <template #organization>
        <OrganizationSelectBox
          :value="sendData.organizationId"
          @valueChanged="organizationChanged"
        />
      </template>
    </DxForm>
  </div>
</template>

<script lang="ts">
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";
import Vue from "vue";
import DxForm, {
  DxGroupItem,
  DxSimpleItem,
  DxLabel,
  DxRequiredRule,
  DxButtonItem,
} from "devextreme-vue/form";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { DxTagBox } from "devextreme-vue/tag-box";
import { NumberBoxProperties } from "../../../infrastructure/components-properties/NumberBoxProperties";
import DataSource from "~/node_modules/devextreme/data/data_source";
export default Vue.extend({
  components: {
    OrganizationSelectBox,
    BaseToolbar,
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxTagBox,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
  },
  data() {
    return {
      numberFrom: null,
      numberTo: null,
      sendData: {
        blankId: null,
        organizationId: +this.$store.getters["user/organizationId"],
        receiverId: null,
      },
    };
  },
  computed: {
    numberFromOptions() {
      return new NumberBoxProperties({
        value: this.numberFrom,
        onValueChanged: (e) => {
          this.numberFrom = e.value;
          this.selectBlanksFromRange();
        },
      });
    },
    numberToOptions() {
      return new NumberBoxProperties({
        value: this.numberTo,
        onValueChanged: (e) => {
          this.numberTo = e.value;
          this.selectBlanksFromRange();
        },
      });
    },
    blanksOptions() {
      return {
        searchEnabled: true,
        searchExpr: "number",
        valueExpr: "id",
        displayExpr: "number",
        multiline: false,
        maxDisplayedTags: 12,
        showSelectionControls: true,
        dataSource: new DataSource({
          store: this.$dxStore({ key: "id", loadUrl: this.$dataApi.blank }),
          filter: [
            ["owner.id", "=", this.$store.getters["user/id"]],
            "and",
            ["isSent", "=", false],
            "and",
            ["isDestroyed", "=", false],
          ],
        }),
      };
    },
    reciverOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: `${this.$dataApi.userByOrganization}${this.sendData.organizationId}`,
        valueExpr: "id",
        displayExpr: "fullName",
      });
    },
  },
  methods: {
    organizationChanged(value) {
      this.sendData.organizationId = value;
      this.sendData.receiverId = null;
    },
    async selectBlanksFromRange() {
      if (this.numberFrom && this.numberTo) {
        const filter = JSON.stringify([
          ["number", ">=", this.numberFrom],
          "and",
          ["number", "<=", this.numberTo],
          "and",
          ["owner.id", "=", this.$store.getters["user/id"]],
          "and",
          ["isSent", "=", false],
        ]);
        const { data: blanks } = await this.$axios.get(
          `${this.$dataApi.blank}?filter=${filter}`
        );
        this.numberFrom = null;
        this.numberTo = null;
        if (blanks.data) this.sendData.blankId = blanks.data.map((el) => el.id);
      }
    },
    sendBlanks() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(`${this.$dataApi.transferBlank}`, this.sendData),
          () => {
            this.$awn.success();
            this.$emit("successedSaved", true);
          },
          () => {
            this.$awn.alert();
          }
        );
      }
    },
  },
});
</script>
