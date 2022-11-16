<template>
  <div>
    <BaseToolbar
      v-if="!readOnly"
      :canSave="true"
      :canDelete="havePrepayment"
      @save="savePrepayment"
      @delete="onDelete"
    />
    <DxForm
      ref="form"
      label-location="top"
      :form-data.sync="prepayment"
      :read-only="readOnly"
    >
      <DxGroupItem
        :col-count="2"
        :caption="$t('navigation.agency.prepaymentTitle')"
      >
        <DxSimpleItem
          data-field="applicantType"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="applicantTypeOptions"
        >
          <DxLabel :text="$t('labels.applicantType')" />
          <DxRequiredRule
            :message="$t('notifications.required.applicantType')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="governmentDutyId"
          data-type="number"
          template="governmentDutySelectBox"
          :col-span="2"
        >
          <DxLabel :text="$t('labels.governmentDuty')" />
          <DxRequiredRule
            :message="$t('notifications.required.governmentDuty')"  
            v-if="this.statementType == StatementType.RegistrationStatement"            
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="agencyPaymentServicesId"
          data-type="number"
          editor-type="dxTagBox"
          :editor-options="paymentServicesOptions"
          :col-span="2"
        >
          <DxLabel
            location="top"
            :text="$t('labels.agencyPaymentServicesId')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="isUrgent"
          data-type="boolean"
          editor-type="dxCheckBox"
          :col-span="2"
        >
          <DxLabel location="left" :text="$t('labels.isUrgent')" />
        </DxSimpleItem>

        <DxSimpleItem
          data-field="governmentDutyCoast"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="sumOptions"
        >
          <DxLabel :text="$t('labels.governmentDutyCoast')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="tehnicalServiceCoast"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="sumOptions"
        >
          <DxLabel :text="$t('labels.tehnicalServiceCoast')" />
        </DxSimpleItem>
      </DxGroupItem>
      <template #governmentDutySelectBox>
        <GovernmentDutySelectBox
          :value="prepayment.governmentDutyId"
          @valueChanged="(value) => (prepayment.governmentDutyId = value)"
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
  DxButtonItem,
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import DxTagBox from "devextreme-vue/tag-box";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import GovernmentDutySelectBox from "~/components/administration/governmentDuty/governmentDuty-select-box/index.vue";

import { ApplicantTypes } from "~/infrastructure/data-sources/ApplicantTypes";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { IPrepayment } from "~/infrastructure/interfaces/agency/paymentServices/IPrepayment";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import DataSource from "~/node_modules/devextreme/data/data_source";
import { StatementType } from "~/infrastructure/enums/StatementType";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
    DxTagBox,
    DxTextArea,
    BaseToolbar,
    GovernmentDutySelectBox,    
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let prepayment: IPrepayment = this.data;
    let statementType;    
    return {
      prepayment,    
      statementType,
      StatementType,  
    };
  },
  computed: {
    canUpdate() {
      let permission: number =
        this.$store.getters["user/claims"]["ManipulateTerritorialUnit"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number =
        this.$store.getters["user/claims"]["RegistrationOfStatement"];
      return PermissionControler.fullAccess(permission);
    },
    applicantTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: ApplicantTypes(this),
      });
    },
    sumOptions() {
      return new NumberBoxProperties({
        readOnly: true,
      });
    },
    havePrepayment() {
      return this.prepayment.id ? true : false;
    },
    paymentServicesOptions() {
      return {
        searchEnabled: true,
        searchExpr: "name",
        valueExpr: "id",
        displayExpr: (item) => {
          return (
            item &&
            `${this.$t("labels.agencyPaymentServiceName")}: ` +
              item.name +
              ` ${this.$t("labels.individualAmount")}: ` +
              item.individualAmount +
              ` ${this.$t("labels.legalAmount")}: ` +
              item.legalAmount
          );
        },
        multiline: false,
        showSelectionControls: true,
        dataSource: new DataSource({
          store: this.$dxStore({
            key: "id",
            loadUrl: this.$dataApi.agencyPaymentService,
          }),
        }),
      };
    },
  },   
  methods: {    
    createPrepayment() {
      this.$awn.asyncBlock(
        this.$axios.post(this.$dataApi.prepayment, this.prepayment),
        (e) => {
          this.$awn.success();
          this.$emit("successedSaved", e.data);
        },
        (e) => {
          this.$awn.alert();
        }
      );
    },
    updatePrepayment() {
      this.$awn.asyncBlock(
        this.$axios.put(
          `${this.$dataApi.prepayment}/${this.prepayment.id}`,
          this.prepayment
        ),
        (e) => {
          this.$awn.success();
          this.$emit("successedSaved", e.data);
        },
        (e) => {
          this.$awn.alert();
        }
      );
    },
    savePrepayment() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        if (this.havePrepayment) {
          this.updatePrepayment();
        } else {
          this.createPrepayment();
        }
      }
    },
    onDelete() {
      const result = confirm(
        this.$t("notifications.confirm.areYouSure"),
        this.$t("notifications.confirm.index")
      );
      result.then((dialogResult) => {
        if (dialogResult) {
          this.$awn.asyncBlock(
            this.$axios.delete(
              `${this.$dataApi.prepayment}/${this.prepayment.id}`
            ),
            (e) => {
              this.$awn.success();
              this.$emit("successedDeleted");
            },
            (e) => {
              this.$awn.alert();
            }
          );
        }
      });
    },
    async getSatementType() {
      const { data } = await this.$axios.get(
        `${this.$dataApi.statements.statement}/${this.prepayment.statementId}`
      );         
      return data.statementType;
    },
  },
  async mounted(){    
    this.statementType = await this.getSatementType();    
  },
});
</script>