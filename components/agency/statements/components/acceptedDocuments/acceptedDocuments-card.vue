<template>
  <div>
    <BaseToolbar
      v-if="!readOnly"
      :canSave="canUpdate || fullAccess"
      @save="onSave"
    />

    <DxForm
      ref="form"
      label-location="top"
      :form-data.sync="formData"
      :read-only="!canUpdate || !fullAccess || readOnly"
    >
      <DxSimpleItem
        data-field="officialDocumentType"
        data-type="number"
        editor-type="dxSelectBox"
        :editor-options="officialDocumentTypeOptions"
      >
        <DxLabel :text="$t('labels.officialDocumentType')" />
        <DxRequiredRule
          :message="$t('notifications.required.officialDocumentType')"
        />
      </DxSimpleItem>
      <DxGroupItem :col-count="2">
        <DxSimpleItem
          data-field="officialDocumentNameId"
          data-type="number"
          template="officialDocumentNameTemplate"
        >
          <DxLabel :text="$t('labels.officialDocumentName')" />
          <DxRequiredRule
            :message="$t('notifications.required.officialDocumentName')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="number"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.number')" />
          <DxRequiredRule :message="$t('notifications.required.number')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="issueDataTime"
          data-type="date"
          editor-type="dxDateBox"
          :editor-options="dateBoxOptions"
        >
          <DxLabel :text="$t('labels.issueDataTime')" />
          <DxRequiredRule
            :message="$t('notifications.required.issueDataTime')"
          />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="issuer"
          data-type="string"
          editor-type="dxAutocomplete"
          :editor-options="issuerOptions"
        >
          <DxLabel :text="$t('labels.issuer')" />
          <DxRequiredRule :message="$t('notifications.required.issuer')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="receivedOfficialDocumentType"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="receivedOfficialDocumentTypeOptions"
        >
          <DxLabel :text="$t('labels.receivedOfficialDocumentType')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="receivedOfficialDocumentCopiesCount"
          data-type="number"
          editor-type="dxNumberBox"
          :editor-options="numberBoxOptions"
        >
          <DxLabel :text="$t('labels.receivedOfficialDocumentCopiesCount')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="expiredDate"
          data-type="date"
          editor-type="dxDateBox"
          :editor-options="dateBoxOptions"
        >
          <DxLabel :text="$t('labels.identityDocumentExpiredDate')" />
        </DxSimpleItem>
      </DxGroupItem>
      <DxGroupItem
        :visible="formData.officialDocumentType === OfficialDocumentType.Deal"
        :col-count="2"
      >
        <DxSimpleItem
          data-field="condition"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.condition')" />
        </DxSimpleItem>
        <DxSimpleItem
          data-field="currencyId"
          data-type="number"
          editor-type="dxSelectBox"
          :editor-options="currencyBoxOptions"
          :col-span="2"
        >
          <DxLabel :text="$t('labels.currency')" />
        </DxSimpleItem>
        <DxGroupItem :visible="formData.currencyId !== null">
          <DxSimpleItem
            data-field="cost"
            data-type="number"
            editor-type="dxNumberBox"
            :editor-options="numberBoxOptions"
          >
            <DxLabel :text="$t('labels.cost')" />
          </DxSimpleItem>
        </DxGroupItem>
      </DxGroupItem>
      <DxSimpleItem
        data-field="isNotLawGivible"
        data-type="boolean"
        editor-type="dxCheckBox"
      >
        <DxLabel location="left" :text="$t('labels.isNotLawGivebele')" />
      </DxSimpleItem>
      <DxSimpleItem
        data-field="description"
        data-type="string"
        editor-type="dxTextArea"
        :editor-options="textAreaOptions"
        :col-span="2"
      >
        <DxLabel :text="$t('labels.description')" />
      </DxSimpleItem>
      <DxSimpleItem
        data-field="fullInformation"
        data-type="string"
        editor-type="dxTextArea"
        :editor-options="fullInformationOptions"
        :col-span="2"
      >
        <DxLabel :text="$t('labels.fullInformation')" />
      </DxSimpleItem>

      <template #officialDocumentNameTemplate>
        <OfficialDocumentName
          :readOnly="!canUpdate || !fullAccess || readOnly"
          :value="formData.officialDocumentNameId"
          @valueChanged="officialDocumentNameChanged"
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
  DxRequiredRule
} from "devextreme-vue/form";
import { DxAutocomplete } from "devextreme-vue/autocomplete";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import OfficialDocumentName from "~/components/administration/officialDocumentName/select-box.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { AutocompletePropertiesWithDataSource } from "~/infrastructure/components-properties/Autocomplete/AutocompletePropertiesWithDataSource";
import { AcceptedDocuments } from "~/infrastructure/classes/AcceptedDocuments";
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

import { OfficialDocumentTypes } from "~/infrastructure/data-sources/agency/OfficialDocumentTypes";
import { ReceivedOfficialDocumentTypes } from "~/infrastructure/data-sources/ReceivedOfficialDocumentTypes";
import { OfficialDocumentType } from "~/infrastructure/enums/agency/OfficialDocumentType";

export default Vue.extend({
  components: {
    BaseToolbar,
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxRequiredRule,
    OfficialDocumentName
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data() {
    let formData: IAcceptedDocuments = new AcceptedDocuments(this.data);
    return {
      formData,
      OfficialDocumentType
    };
  },
  computed: {
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "OfficialDocument"
      ];
      return PermissionControler.canUpdate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"][
        "OfficialDocument"
      ];
      return PermissionControler.fullAccess(permission);
    },
    officialDocumentTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: OfficialDocumentTypes(this),
        onValueChanged: e => {
          this.formData.condition = "";
          this.formData.cost = null;
          this.formData.currencyId = null;
        }
      });
    },
    receivedOfficialDocumentTypeOptions() {
      return new SelectBoxPropertiesWithLocalData({
        dataSource: ReceivedOfficialDocumentTypes(this)
      });
    },
    currencyBoxOptions() {
      return new SelectBoxPropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.currency
      });
    },
    issuerOptions() {
      return new AutocompletePropertiesWithDataSource(this, {
        loadUrl: this.$dataApi.letterSenderOrganization,
        valueExpr: "name",
        key: "name"
      });
    },
    numberBoxOptions() {
      return new NumberBoxProperties();
    },
    textBoxOptions() {
      return new TextBoxProperties();
    },
    textAreaOptions() {
      return new TextAreaProperties();
    },
    fullInformationOptions() {
      return new TextAreaProperties({
        readOnly: true
      });
    },
    dateBoxOptions() {
      return new DateBoxProperties();
    },
    officialDocumentNameId() {
      return this.formData.officialDocumentNameId;
    },
    number() {
      return this.formData.number;
    },
    issueDataTime() {
      return this.formData.issueDataTime;
    },
    expiredDate() {
      return this.formData.expiredDate;
    },
    issuer() {
      return this.formData.issuer;
    }
  },
  watch: {
    officialDocumentNameId() {
      this.getFullInformation();
    },
    number() {
      this.getFullInformation();
    },
    issueDataTime() {
      this.getFullInformation();
    },
    expiredDate() {
      this.getFullInformation();
    },
    issuer() {
      this.getFullInformation();
    }
  },
  methods: {
    async getFullInformation() {
      try {
        let { data } = await this.$axios.get(
          this.$dataApi.stringParser.officialDocument,
          {
            params: {
              officialDocumentNameId: this.officialDocumentNameId,
              number: this.number,
              issueDataTime: this.issueDataTime,
              expiredDate: this.expiredDate,
              issuer: this.issuer
            }
          }
        );
        this.formData.fullInformation = data;
      } catch (error) {
        console.error(error);
      }
    },
    officialDocumentNameChanged(value) {
      this.formData.officialDocumentNameId = value;
    },
    onSave() {
      let result = this.$refs["form"].instance.validate();
      if (result.isValid) {
        this.$emit("successedSaved", this.formData);
      }
    }
  }
});
</script>
