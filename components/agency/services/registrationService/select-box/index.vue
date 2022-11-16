<template>
  <div>
    <DxSelectBox
      ref="registrationServiceSelectBox"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
      :data-source="dataSource"
      :value="value"
      :buttons="buttons"
      :read-only="readOnly"
      :showClearButton="true"
      :search-enabled="true"
      :search-expr="displayExpr"
      :open-on-field-click="false"
      @value-changed="valueChanged"
    />
    <BasePopup
      ref="basePopup"
      width="70%"
      height="90vh"
      :show-title="true"
      :title="$t('navigation.agency.registrationServiceSelectBox')"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <CaseViewDataGrid
        v-if="displayCase"
        :filter="filter"
        @valueSelected="
          value => {
            getRegistrationServiceFromCaseBookId(value);
          }
        "
      />
      <RegistrationServiceViewDataGreed
        v-else
        :valueExpr="valueExpr"
        :filter="filter"
        @valueSelected="valueSelected"
      />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { DxSelectBox } from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import RegistrationServiceViewDataGreed from "./registrationService-view-data-greed.vue";
import CaseViewDataGrid from "./caseViewDataGrid/index.vue";
import RegistrationServiceCard from "../registrationService-card.vue";

export default Vue.extend({
  components: {
    DxSelectBox,
    BasePopup,
    RegistrationServiceViewDataGreed,
    RegistrationServiceCard,
    CaseViewDataGrid
  },
  name: "RegistrationServiceSelectBox",
  props: {
    value: {
      default: null
    },
    valueExpr: {
      type: String,
      default: "id"
    },
    displayExpr: {
      type: String,
      default: "registrationServiceNumber"
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    displayCase: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.services.registrationService
        }),
        filter: this.displayCase ? [] : this.filter
      })
    };
  },
  computed: {
    buttons() {
      return [
        {
          location: "after",
          name: "clear"
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
            }
          }
        }
      ];
    }
  },
  methods: {
    async getRegistrationServiceFromCaseBookId(caseBook) {
      const { data } = await this.$axios.get(
        `${this.$dataApi.services.registrationService}/caseBook/${caseBook.id}`
      );
      this.valueSelected(data);
    },
    async reloadSelectBox() {
      this.$refs.basePopup.close();
      await this.dataSource.reload();
      this.$refs["registrationServiceSelectBox"].instance.repaint();
    },
    valueSelected(data) {
      this.reloadSelectBox();
      this.$emit("valueChanged", data);
    },
    valueChanged(e) {
      this.$emit("valueChanged", e.value);
    }
  }
});
</script>
