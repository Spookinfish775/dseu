<template>
  <div class="card-wrapper">
    <BaseToolbar
      :canSave="canUpdate"
      :canDelete="fullAccess"
      :canDownload="true"
      :canPrint="true"
      @save="onSave"
      @delete="onDelete"
      @download="onDownload"
      @print="onPrint"
    />
    <DxForm
      ref="form"
      label-location="top"
      :read-only="readOnly"
      :form-data.sync="formData"
    >
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
        <DxSimpleItem
          data-field="systemServiceDate"
          data-type="date"
          editor-type="dxDateBox"
          :editor-options="executionTimeOptions"
        >
          <DxLabel :text="$t('labels.systemDate')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="userId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="userOptions"
        >
          <DxLabel :text="$t('labels.executor')" />
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
          :readOnly="readOnly || changeStatementId != null"
          @valueChanged="changeStatementSelected"
        />
      </template>
    </DxForm>
    <DocumentEditorPopup
      v-model="documentEditorVisible"
      :data="documentEditorData"
    />
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
  DxButtonItem
} from "devextreme-vue/form";
import "devextreme-vue/text-area";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";

import { StatementType } from "~/infrastructure/enums/StatementType";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IChangeService } from "~/infrastructure/interfaces/agency/services/IChangeService";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
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
    DocumentEditorPopup
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
    changeStatementId: {
      type: Number,
      default: null
    }
  },
  data() {
    let formData: IChangeService = this.data;

    return {
      formData,
      StatementType,
      documentEditorData: null,
      documentEditorVisible: false,
      realEstateId: null
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "ChangeService"
      ];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "ChangeService"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "ChangeService"
      ];
      return PermissionControler.fullAccess(permission);
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    enteredServiceDateOptions() {
      return new DateBoxProperties({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
        type: "datetime",
        applyValueMode: "useButtons"
      });
    },
    executionTimeOptions() {
      return new DateBoxProperties({
        readOnly: true
      });
    },
    userOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.user,
        displayExpr: "fullName",
        readOnly: true
      });
    }
  },
  methods: {
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
          this.$axios.put(
            `${this.$dataApi.services.changeService}/${this.formData.id}`,
            this.formData
          ),

          e => {
            this.$awn.success();
            this.$emit("successedSaved", e.data);
          },
          e => {
            this.$awn.alert();
          }
        );
      }
    },
    onDelete() {
      const result = confirm(
        this.$t("notifications.confirm.areYouSure"),
        this.$t("notifications.confirm.index")
      );
      result.then(dialogResult => {
        if (dialogResult) {
          this.$awn.asyncBlock(
            this.$axios.delete(
              `${this.$dataApi.services.changeService}/${this.formData.id}`
            ),
            e => {
              this.$awn.success();
              this.$emit("successedDeleted");
            },
            e => {
              this.$awn.alert();
            }
          );
        }
      });
    },
    onDownload() {
      DocumentLoader.load(this, {
        loadUrl: `${this.$dataApi.download.changeService}/${this.formData.id}`,
        name: `${this.$t("navigation.agency.changeServiceTitle")} № ${
          this.formData.index
        }.docx`
      });
    },
    onPrint() {
      if (this.documentEditorData === null) {
        this.$awn.asyncBlock(
          this.$axios.get(
            `${this.$dataApi.getHtml.changeService}/${this.formData.id}`
          ),
          e => {
            this.$awn.success();
            this.documentEditorData = e.data;
            this.documentEditorVisible = true;
          },
          e => {
            this.$awn.alert();
          }
        );
      } else {
        this.documentEditorVisible = true;
      }
    }
  },
  created() {
    if (this.changeStatementId != null)
      this.formData.changeStatementId = this.changeStatementId;
    if (this.formData.changeStatementId)
      this.getChangeStatement(this.formData.changeStatementId);
  }
});
</script>
