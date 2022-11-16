<template>
  <div>
    <DxSelectBox
      ref="selectBox"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
      :data-source="dataSource"
      :value="value"
      :read-only="readOnly"
      :showClearButton="true"
      :search-enabled="true"
      :search-expr="displayExpr"
      :open-on-field-click="false"
      :buttons="buttons"
      @value-changed="valueChanged"
    />
    <BasePopup
      ref="basePopup"
      :width="'70%'"
      :height="'auto'"
      :show-title="true"
      :title="$t('navigation.agency.statementsTitle')"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <component
        v-if="isCard"
        :is="serviceType"
        :data="selectedValue"
        :readOnly="true"
      />
      <DataGrid @valueSelected="valueSelected" v-else />
    </BasePopup>
  </div>
</template>

<script>
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import BasePopup from "~/components/page/popup.vue";
import DataSource from "devextreme/data/data_source";

import ChangeService from "~/components/agency/services/changeService/card.vue";
import ConfirmationService from "~/components/agency/services/confirmationService/card.vue";
import GiveInformationService from "~/components/agency/services/giveInformationService/card.vue";
import LegalAidService from "~/components/agency/services/legalAidService/card.vue";
import RefusalService from "~/components/agency/services/refusalService/card.vue";
import RegistrationService from "~/components/agency/services/registrationService/registrationService-card.vue";
import SuspendService from "~/components/agency/services/suspendService/card.vue";

import DataGrid from "./view-data-grid.vue";


export default Vue.extend({
  components: {
    DxSelectBox,
    BasePopup,
    DataSource,
    DataGrid,
    ChangeService,
    ConfirmationService,
    GiveInformationService,
    LegalAidService,
    RefusalService,
    RegistrationService,
    SuspendService,
  },
  props: {
    value: {
      default: null,
    },
    valueExpr: {
      type: String,
      default: "id",
    },
    displayExpr: {
      type: String,
      default: "id",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.services.service,
        }),
      }),
      serviceType: null,
      selectedValue: null,
      isCard: false,
    };
  },
  computed: {
    buttons() {
      return [
        {
          location: "after",
          name: "clear",
        },
        {
          location: "after",
          name: "list",
          options: {
            icon: "bulletlist",
            stylingMode: "text",
            visible: !this.readOnly,
            onClick: () => {
              this.$refs.basePopup.open();
            },
          },
        },
      ];
    },
  },
  methods: {
    valueChanged(e) {
      this.$emit("valueChanged", e.value);
    },
    valueSelected(e) {
      this.$emit("valueChanged", e);
      this.$refs.basePopup.close();
    },
  },
});
</script>