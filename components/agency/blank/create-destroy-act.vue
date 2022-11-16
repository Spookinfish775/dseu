<template>
  <div>
    <BaseToolbar :canSave="true" :canDelete="false" @save="createDestroyAct" />
    <DxForm ref="form" label-location="top" :form-data.sync="destroyAct">
      <DxSimpleItem data-field="actNumber">
        <DxLabel location="top" :text="$t('labels.number')" />
        <DxRequiredRule :message="$t('notifications.required.number')" />
      </DxSimpleItem>
      <DxGroupItem>
        <DxSimpleItem
          data-field="actDate"
          editor-type="dxDateBox"
          :editor-options="actDateOptions"
        >
          <DxLabel location="top" :text="$t('labels.date')" />
          <DxRequiredRule :message="$t('notifications.required.date')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="blankId"
          data-type="number"
          editor-type="dxTagBox"
          :editor-options="blanksOptions"
        >
          <DxLabel location="top" :text="$t('labels.blanks')" />
          <DxRequiredRule :message="$t('notifications.required.blankId')" />
        </DxSimpleItem>
        <DxGroupItem :col-count="2" :caption="$t('labels.numberRange')">
          <DxSimpleItem
            editor-type="dxNumberBox"
            :editor-options="numberFromOptions"
          >
            <DxLabel location="top" :text="$t('labels.numberFrom')" />
          </DxSimpleItem>
          <DxSimpleItem
            editor-type="dxNumberBox"
            :editor-options="numberToOptions"
          >
            <DxLabel location="top" :text="$t('labels.numberTo')" />
          </DxSimpleItem>
          <DxSimpleItem
            :col-span="2"
            data-field="actNote"
            editorType="dxTextArea"
          >
            <DxLabel location="top" :text="$t('labels.note')" />
          </DxSimpleItem>
        </DxGroupItem>
      </DxGroupItem>
    </DxForm>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DxForm, {
  DxGroupItem,
  DxSimpleItem,
  DxLabel,
  DxRequiredRule,
  DxButtonItem,
} from "devextreme-vue/form";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { DxTagBox } from "devextreme-vue/tag-box";
import DxTextArea from "devextreme-vue/text-area";
import { NumberBoxProperties } from "../../../infrastructure/components-properties/NumberBoxProperties";
import DataSource from "~/node_modules/devextreme/data/data_source";
import { blankState } from "~/infrastructure/enums/agency/blankState";
export default Vue.extend({
  components: {
    BaseToolbar,
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxTagBox,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
    DxTextArea,
  },
  data() {
    return {
      numberFrom: null,
      numberTo: null,
      destroyAct: {
        blankId: null,
        actNumber: null,
        actDate: new Date(),
        actNote: null,
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
            [
              ["blankState", "=", blankState.Defected],
              "or",
              ["blankState", "=", blankState.Damaged],
              "or",
              ["blankState", "=", blankState.Empty],
            ],
            "and",
            ["isDestroyed", "=", false],
          ],
        }),
      };
    },
    actDateOptions() {
      return new DateBoxProperties();
    },
  },
  methods: {
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
          [
            ["blankState", "=", blankState.Defected],
            "or",
            ["blankState", "=", blankState.Damaged],
            "or",
            ["blankState", "=", blankState.Empty],
          ],
          "and",
          ["isDestroyed", "=", false],
        ]);
        const { data: blanks } = await this.$axios.get(
          `${this.$dataApi.blank}?filter=${filter}`
        );
        this.numberFrom = null;
        this.numberTo = null;
        if (blanks.data)
          this.destroyAct.blankId = blanks.data.map((el) => el.id);
      }
    },
    createDestroyAct() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(`${this.$dataApi.blankDestroy}`, this.destroyAct),
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
