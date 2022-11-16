<template>
  <div>
    <DxSelectBox
      ref="selectBox"
      :value="value"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
      :data-source="statements"
      :buttons="buttons"
      :read-only="readOnly"
      :showClearButton="true"
      :search-enabled="true"
      :search-expr="displayExpr"
      :open-on-field-click="false"
      @value-changed="valueChanged"
    />
    <BasePopup
      ref="statementsPopup"
      width="70vw"
      height="70vh"
      :show-title="true"
      :title="$t('navigation.agency.statementsTitle')"
    >
      <component
        v-if="isCard"
        :is="statementType"
        :data="selectedValue"
        :readOnly="readOnly"
      />
      <StatementsViewDataGreed
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
import BasePopup from "~/components/page/popup.vue";
import DataSource from "devextreme/data/data_source";

//Statemets
import RegistrationStatement from "~/components/agency/statements/registrationStatement/card.vue";
import SuspendStatement from "~/components/agency/statements/suspendStatement/card.vue";
import ConfirmationStatement from "~/components/agency/statements/confirmationStatement/card.vue";
import ChangeStatement from "~/components/agency/statements/changeStatement/card.vue";
import GiveInformationStatement from "~/components/agency/statements/giveInformationStatement/card.vue";
import LegalAidStatement from "~/components/agency/statements/legalAidStatement/card.vue";

import StatementsViewDataGreed from "~/components/agency/statements/components/statements-select-box/statements-view-data-greed.vue";
import RealEstateCard from "~/components/realEstate/realEstate-card.vue";
import { StatementType } from "~/infrastructure/enums/StatementType";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxSelectBox,
    BasePopup,
    StatementsViewDataGreed,
    RealEstateCard,
    RegistrationStatement,
    SuspendStatement,
    ChangeStatement,
    GiveInformationStatement,
    LegalAidStatement,
    ConfirmationStatement
  },
  name: "StatementsSelectBox",
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
      default: "index"
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      statements: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.statements.statement
        }),
        filter: this.filter
      }),
      statementType: null,
      selectedValue: null,
      isCard: false
    };
  },
  computed: {
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["Statement"];
      return PermissionControler.canCreate(permission);
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"]["Statement"];
      return PermissionControler.canUpdate(permission);
    },
    buttons() {
      return [
        {
          location: "after",
          name: "clear"
        },
        {
          location: "after",
          name: "info",
          options: {
            icon: "info",
            stylingMode: "text",
            disabled: false,
            visible: this.value != null,
            onClick: () => {
              if (this.valueExpr == "id") {
                this.$awn.asyncBlock(
                  this.$axios.get(
                    `${this.$dataApi.statements.statement}/${this.value}`
                  ),
                  e => {
                    this.statementType = StatementType[e.data.statementType];
                    this.selectedValue = e.data;
                    this.isCard = true;
                    this.$refs["statementsPopup"].open();
                  },
                  e => {
                    this.$awn.alert();
                  }
                );
              }
            }
          }
        },
        {
          location: "after",
          name: "list",
          options: {
            icon: "bulletlist",
            stylingMode: "text",
            visible: this.canCreate && !this.readOnly,
            onClick: () => {
              this.isCard = false;
              this.$refs["statementsPopup"].open();
            }
          }
        }
      ];
    }
  },
  watch: {
    popupVisible(visible) {
      if (!visible) {
        this.selectedValue = null;
        this.statementType = null;
        this.isCard = false;
      }
    }
  },
  methods: {
    async successedSaved(data) {
      this.$refs["statementsPopup"].close();
      await this.statements.reload();
      this.$refs["selectBox"].instance.repaint();
      this.$emit("valueChanged", data[this.valueExpr]);
    },
    async successedDeleted() {
      this.$refs["statementsPopup"].close();
      await this.statements.reload();
      this.$refs["selectBox"].instance.repaint();
      this.$emit("valueChanged", null);
    },
    async valueSelected(data) {
      this.$refs["statementsPopup"].close();
      await this.statements.reload();
      this.$refs["selectBox"].instance.repaint();
      this.$emit("valueChanged", data);
    },
    valueChanged(e) {
      this.$emit("valueChanged", e.value);
    }
  }
});
</script>
