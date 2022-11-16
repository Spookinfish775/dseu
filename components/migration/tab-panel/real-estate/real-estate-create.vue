<template>
  <div class="card-wrapper">
    <BaseToolbar :canSave="canCreate" @save="saveRealEstate" />
    <p class="oldData">
      Gelen maglumat : <b>{{ data.address }}</b>
    </p>
    <DxForm
      ref="form"
      label-location="top"
      :form-data.sync="realEstate"
      :col-count="2"
    >
      <DxGroupItem :caption="$t('labels.generalInformation')">
        <DxSimpleItem
          data-field="caseRealEstateType"
          data-type="number"
          template="caseRealEstateTypeSelectBox"
          :help-text="'Gelen maglumat : ' + data.caseRealEstateType"
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
          :help-text="$t('labels.nameHelp')"
        >
          <DxLabel :text="$t('labels.name')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="number"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="numberBoxOptions"
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
          :read-only="true"
          :help-text="'Gelen maglumat : ' + data.address"
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
            :help-text="'Gelen maglumat : ' + data.cadastralCost"
          >
            <DxLabel :text="$t('labels.cadastralCost')" />
          </DxSimpleItem>
          <DxSimpleItem
            data-field="dealCost"
            data-type="number"
            editor-type="dxNumberBox"
            :editor-options="numberBoxOptions"
            :help-text="'Gelen maglumat : ' + data.dealCost"
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
          :help-text="'Gelen maglumat : ' + data.cadastralNumber"
        >
          <DxLabel :text="$t('labels.cadastralNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="virtualCadastralNumber"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
          :help-text="'Gelen maglumat : ' + data.virtualCadastralNumber"
        >
          <DxLabel :text="$t('labels.virtualCadastralNumber')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="square"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
          :help-text="'Gelen maglumat : ' + data.square"
        >
          <DxLabel :text="$t('labels.square')" />
          <DxRequiredRule :message="$t('notifications.required.square')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="areaUnits"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="areaUnitsOptions"
        >
          <DxLabel :text="$t('labels.areaUnits')" />
          <DxRequiredRule />
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
          :help-text="'Gelen maglumat : ' + data.invertarNumber"
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
          :help-text="'Gelen maglumat : ' + data.liveSquare"
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
          :help-text="'Gelen maglumat : ' + data.flat"
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
          :help-text="'Gelen maglumat : ' + data.roomTotal"
        >
          <DxLabel :text="$t('labels.roomTotal')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="areaUnits"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="areaUnitsOptions"
        >
          <DxLabel :text="$t('labels.areaUnits')" />
          <DxRequiredRule />
        </DxSimpleItem>
      </DxGroupItem>
      <template #territorialUnitSelectBox>
        <TerritorialUnitSelectBox
          :readOnly="!canUpdate || !fullAccess"
          :value="realEstate.territorialUnitId"
          @valueChanged="territorialUnitChanged"
        />
      </template>
      <template #realEstateMissionSelectBox>
        <RealEstateMissionSelectBox
          :readOnly="!canUpdate || !fullAccess"
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
import { AreaUnits } from "~/infrastructure/data-sources/AreaUnits";
import { AreaUnit } from "~/infrastructure/enums/AreaUnit";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { RealEstate } from "~/infrastructure/classes/RealEstate";
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
    uploadedStateRegisterId: {
      type: Number,
      required: true
    },
    uploadedStateRegisters: {
      type: Array,
      required: true
    }
  },
  data() {
    let realEstate: IRealEstate = new RealEstate(this.data);
    return {
      realEstate,
      RealEstateType
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
        onValueChanged: e => {
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
          this.realEstate.areaUnits =
            e.value === RealEstateType.Land ? AreaUnit.ha : AreaUnit.m2;
        }
      });
    },
    areaUnitsOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: AreaUnits(this)
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
          this.$axios.post(this.$dataApi.dataMigration.realEstate, {
            uploadedStateRegisterId: this.uploadedStateRegisterId,
            uploadedStateRegisters: this.uploadedStateRegisters,
            ...this.realEstate
          }),
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
