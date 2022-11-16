<template>
  <div class="card-wrapper">
    <BaseToolbar :canSave="canCreate" @save="onSave" />
    <DxForm ref="form" label-location="top" :form-data.sync="formData">
      <DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
        <DxSimpleItem
          data-field="changeStatementId"
          data-type="number"
          template="statementSelectBox"
        >
          <DxLabel :text="$t('labels.changeStatement')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="caseBookId"
          data-type="number"
          template="caseBookSelectBox"
        >
          <DxLabel :text="$t('labels.caseBook')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          :col-span="2"
          data-field="changedDescription"
          data-type="string"
          editor-type="dxTextArea"
          :editor-options="textAreaOptions"
        >
          <DxLabel :text="$t('labels.changedDescription')" />
          <DxRequiredRule />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="enteredServiceDate"
          data-type="datetime"
          editor-type="dxDateBox"
          :editor-options="enteredServiceDateOptions"
        >
          <DxRequiredRule />
          <DxLabel :text="$t('labels.enteredServiceDate')" />
        </DxSimpleItem>
      </DxGroupItem>
      <template #caseBookSelectBox>
        <CaseSelectBox
          :value="formData.caseBookId"
          :withCaseBook="true"
          :readOnly="realEstateId === null"
          displayExpr="registrationServiceNumber"
          :caseBookFilter="['realEstateId', '=', realEstateId]"
          @caseBookSelected="caseBookSelected"
        />
      </template>
      <template #statementSelectBox>
        <StatementsSelectBox
          :value="formData.changeStatementId"
          :filter="['statementType', '=', StatementType.ChangeStatement]"
          :readOnly="changeStatementId != null"
          @valueChanged="changeStatementSelected"
        />
      </template>
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
  DxEmailRule,
  DxAsyncRule,
  DxPatternRule,
  DxButtonItem,
} from "devextreme-vue/form";
import "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import CaseSelectBox from "~/components/case/select-box/index.vue";

import { StatementType } from "~/infrastructure/enums/StatementType";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { ChangeService } from "~/infrastructure/classes/agency/services/ChangeService";
import { IChangeService } from "~/infrastructure/interfaces/agency/services/IChangeService";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxEmailRule,
    DxPatternRule,
    DxAsyncRule,
    DxButtonItem,
    BaseToolbar,
    StatementsSelectBox,
    CaseSelectBox,
  },
  props: {
    changeStatementId: {
      type: Number,
      default: null,
    },
  },
  data() {
    let formData: IChangeService = new ChangeService();

    return {
      formData,
      StatementType,
      realEstateId: null,
    };
  },
  computed: {
    canCreate() {
      let permission: number =
        this.$store.getters["user/claims"]["ChangeService"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number =
        this.$store.getters["user/claims"]["ChangeService"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number =
        this.$store.getters["user/claims"]["ChangeService"];
      return PermissionControler.fullAccess(permission);
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    enteredServiceDateOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
        type: "datetime",
        applyValueMode: "useButtons",
      });
    },
  },
  methods: {
    caseBookSelected(data) {
      this.formData.caseBookId = data.id;
    },
    changeStatementSelected(id) {
      if (id) {
        this.formData.changeStatementId = id;
        this.getChangeStatement(id);
      } else {
        this.realEstateId = null;
      }
    },
    async getChangeStatement(id) {
      const { data } = await this.$axios.get(
        `${this.$dataApi.statements.changeStatement}/${id}`
      );
      this.realEstateId = data.realEstateId;
    },
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.post(
            `${this.$dataApi.services.changeService}`,
            this.formData
          ),
          (e) => {
            this.$awn.success();
            this.$emit("successedSaved", e.data);
          },
          (e) => {
            this.$awn.alert();
          }
        );
      }
    },
  },
  created() {
    if (this.changeStatementId != null)
      this.formData.changeStatementId = this.changeStatementId; 
    if (this.formData.changeStatementId)
      this.getChangeStatement(this.formData.changeStatementId);
  },
});
</script>
