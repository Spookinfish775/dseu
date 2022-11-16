<template>
  <div class="card-wrapper">
    <BaseToolbar v-if="!readOnly" :canSave="canUpdate" @save="saveRealEstate" />
    <p class="oldData">
      {{ $t("labels.incomingInformation") }} : <b>{{ oldData.address }}</b>
    </p>
    <DxForm
      ref="form"
      label-location="top"
      :form-data.sync="realEstate"
      :col-count="2"
      :read-only="disabled"
    >
      <DxGroupItem :caption="$t('labels.generalInformation')">
        <DxSimpleItem
          data-field="encumbranceProcessType"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="encumbranceProcessTypeOptions"
        >
          <DxLabel :text="$t('labels.encumbranceProcessType')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="conventionalNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="conventionalNumberOptions"
        >
          <DxLabel :text="$t('labels.conventionalNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="caseRealEstateType"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="realEstateTypeOptions"
        >
          <DxLabel :text="$t('labels.realEstateType')" />
          <DxRequiredRule
            :message="$t('notifications.required.realEstateType')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="territorialUnitId"
          data-type="number"
          template="territorialUnitSelectBox"
        >
          <DxLabel :text="$t('labels.territorialUnit')" />
          <DxRequiredRule
            :message="$t('notifications.required.territorialUnit')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="name"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.name')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="number"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="numberLabel" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="realEstateMissionId"
          data-type="number"
          template="realEstateMissionSelectBox"
        >
          <DxLabel :text="$t('labels.realEstateMission')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="address"
          data-type="string"
          editor-type="dxTextArea"
          :editor-options="addressTextAreaOptions"
        >
          <DxLabel :text="$t('labels.address')" />
          <DxRequiredRule :message="$t('notifications.required.address')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="subdivision"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.subdivision')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="liveSubdivision"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.liveSubdivision')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="description"
          data-type="string"
          editor-type="dxTextArea"
          :editor-options="textAreaOptions"
        >
          <DxLabel :text="$t('labels.realEstatePurpose')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="status"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="statusOptions"
        >
          <DxLabel :text="$t('labels.status')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="currencyId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="currencyOptions"
        >
          <DxLabel :text="$t('labels.currency')" />
        </DxSimpleItem>
        <DxGroupItem :visible="realEstate.currencyId !== null">
          <DxSimpleItem
            data-field="cadastralCost"
            data-type="number"
            editor-type="dxNumberBox"
            :editor-options="numberBoxOptions"
          >
            <DxLabel :text="$t('labels.cadastralCost')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="dealCost"
            data-type="number"
            editor-type="dxNumberBox"
            :editor-options="numberBoxOptions"
          >
            <DxLabel :text="$t('labels.dealCost')" />
          </DxSimpleItem>
        </DxGroupItem>
      </DxGroupItem>

      <DxGroupItem
        :visible="realEstate.caseRealEstateType === RealEstateType.Land"
      >
        <DxSimpleItem
          data-field="cadastralNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.cadastralNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="square"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.square')" />
          <DxRequiredRule :message="$t('notifications.required.square')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem
        :visible="
          realEstate.caseRealEstateType === RealEstateType.Building ||
            realEstate.caseRealEstateType === RealEstateType.Complex ||
            realEstate.caseRealEstateType === RealEstateType.Flat
        "
      >
        <DxSimpleItem
          data-field="invertarNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.invertarNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="commonSquare"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.commonSquare')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="liveSquare"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.liveSquare')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="flatTotal"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.flatTotal')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="aboveGroundFloorsCount"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.aboveGroundFloorsCount')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="undergroundFloorsCount"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.undergroundFloorsCount')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="flat"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.flat')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="apartmentNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.apartmentNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="roomTotal"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.roomTotal')" />
        </DxSimpleItem>
      </DxGroupItem>
      <template #territorialUnitSelectBox>
        <TerritorialUnitSelectBox
          :readOnly="!canUpdate || !fullAccess || disabled"
          :value="realEstate.territorialUnitId"
          @valueChanged="territorialUnitChanged"
        />
      </template>
      <template #realEstateMissionSelectBox>
        <RealEstateMissionSelectBox
          :readOnly="!canUpdate || !fullAccess || disabled"
          :value="realEstate.realEstateMissionId"
          @valueChanged="val => (realEstate.realEstateMissionId = val)"
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
  DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RegionSelectBox from "~/components/administration/region/region-select-box.vue";
import DistrictSelectBox from "~/components/administration/district/district-select-box.vue";
import TerritorialUnitSelectBox from "~/components/territorialUnit/territorialUnit-select-box/index.vue";
import RealEstateMissionSelectBox from "~/components/administration/realEstateMission/select-box.vue";

import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
import { RealEstateType } from "~/infrastructure/enums/RealEstateType";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { EncumbranceProcessTypes } from "~/infrastructure/data-sources/EncumbranceProcessTypes";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { IRealEstate } from "~/infrastructure/interfaces/IRealEstate";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    DxButtonItem,
    DxTextArea,
    BaseToolbar,
    RegionSelectBox,
    DistrictSelectBox,
    TerritorialUnitSelectBox,
    RealEstateMissionSelectBox
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    oldData: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let realEstate: IRealEstate = this.data;
    return {
      realEstate,
      RealEstateType,
      disabled: this.readOnly,
      oldData: JSON.parse(JSON.stringify(this.data))
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["RealEstate"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"]["RealEstate"];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"]["RealEstate"];
      return PermissionControler.fullAccess(permission);
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    conventionalNumberOptions() {
      return new TextBoxProperties({
        readOnly: true
      });
    },
    addressTextAreaOptions() {
      return new TextAreaProperties({
        readOnly: true
      });
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    numberBoxOptions() {
      return new NumberBoxProperties();
    },
    currencyOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.currency
      });
    },
    territorialUnitOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.territorialUnit
      });
    },
    realEstateTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: RealEstateTypes(this),
        onValueChanged: () => {
          this.realEstate.cadastralNumber = "";
          this.realEstate.square = null;
          this.realEstate.invertarNumber = "";
          this.realEstate.liveSquare = null;
          this.realEstate.commonSquare = null;
          this.realEstate.flatTotal = null;
          this.realEstate.aboveGroundFloorsCount = null;
          this.realEstate.undergroundFloorsCount = null;
          this.realEstate.flat = null;
          this.realEstate.apartmentNumber = null;
          this.realEstate.roomTotal = null;
        }
      });
    },
    statusOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: Statuses(this),
        onValueChanged: () => {
          this.disabled = true;
          this.realEstate = this.oldData;
          setTimeout(() => {
            this.$refs["form"].instance.repaint();
          }, 100);
        }
      });
    },
    encumbranceProcessTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: EncumbranceProcessTypes(this),
        readOnly: true
      });
    },
    numberLabel() {
      if (this.realEstate.caseRealEstateType === RealEstateType.Land) {
        return `${this.$t("realEstateType.land")} ${this.$t("labels.number")}`;
      } else if (
        this.realEstate.caseRealEstateType === RealEstateType.Building
      ) {
        return `${this.$t("labels.house")} ${this.$t("labels.number")}`;
      } else {
        return `${this.$t("labels.number")}`;
      }
    },
    territorialUnitId() {
      return this.realEstate.territorialUnitId;
    },
    name() {
      return this.realEstate.name;
    },
    number() {
      return this.realEstate.number;
    },
    apartmentNumber() {
      return this.realEstate.apartmentNumber;
    },
    caseRealEstateType() {
      return this.realEstate.caseRealEstateType;
    }
  },
  watch: {
    territorialUnitId() {
      this.getFullAddress();
    },
    name() {
      this.getFullAddress();
    },
    number() {
      this.getFullAddress();
    },
    apartmentNumber() {
      this.getFullAddress();
    },
    caseRealEstateType() {
      this.getFullAddress();
    }
  },
  methods: {
    territorialUnitChanged(data) {
      this.realEstate.territorialUnitId = data;
    },
    async getFullAddress() {
      if (this.territorialUnitId !== null) {
        let { data } = await this.$axios.get(
          this.$dataApi.stringParser.realEstate,
          {
            params: {
              territorialUnitId: this.territorialUnitId,
              name: this.name,
              number: this.number,
              apartmentNumber: this.apartmentNumber,
              caseRealEstateType: this.caseRealEstateType
            }
          }
        );
        this.realEstate.address = data;
      }
    },
    saveRealEstate() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$awn.asyncBlock(
          this.$axios.put(
            `${this.$dataApi.realEstate}/${this.realEstate.id}`,
            this.realEstate
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
    }
  }
});
</script>
