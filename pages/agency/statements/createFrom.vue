<template>
  <div>
    <PageHeader
      :showBackBtn="true"
      :title="pageTitle"
      :description="pageDescription"
    />
    <component
      v-if="confirmed"
      :is="createStatementType"
      :data="currentData"
      @successedSaved="successedSaved"
    />
    <ConfirmationPopup
      ref="confirmationPopup"
      :message="$t('notifications.confirm.createNewRealEstate')"
    />
    <BasePopup
      ref="realEstatePopup"
      width="70vw"
      height="70vh"
      :show-title="true"
      :title="$t('navigation.realEstate.createRealEstateTitle')"
    >
      <RealEstateCreate @successedSaved="successedSavedRealEstate" />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/page/page-header.vue";
import ChangeStatement from "~/components/agency/statements/changeStatement/create.vue";
import RegistrationStatement from "~/components/agency/statements/registrationStatement/create.vue";
import SuspendStatement from "~/components/agency/statements/suspendStatement/create.vue";
import ConfirmationStatement from "~/components/agency/statements/confirmationStatement/create.vue";
import GiveInformationStatement from "~/components/agency/statements/giveInformationStatement/create.vue";
import LegalAidStatement from "~/components/agency/statements/legalAidStatement/create.vue";
import { StatementType } from "~/infrastructure/enums/StatementType";
import { dataApi } from "~/static/dataApi";
import { RealEstateType } from "~/infrastructure/enums/RealEstateType";

import ConfirmationPopup from "~/components/page/confirm-popup.vue";
import BasePopup from "~/components/page/popup.vue";
import RealEstateCreate from "~/components/realEstate/realEstate-create.vue";

export default Vue.extend({
  // middleware: ["administration/users/create"],
  components: {
    PageHeader,
    RegistrationStatement,
    SuspendStatement,
    ChangeStatement,
    ConfirmationStatement,
    GiveInformationStatement,
    LegalAidStatement,
    ConfirmationPopup,
    BasePopup,
    RealEstateCreate
  },
  data() {
    return {
      notify: false,
      confirmed: false
    };
  },
  computed: {
    pageTitle() {
      let title: string = `${this.createStatementTypeName} - ${
        this.fromStatementTypeName
      } ${this.$t("labels.createFrom")}`;
      return title;
    },
    pageDescription() {
      let description: string = this.$t("labels.createFromDescription");
      return description;
    },
    fromStatementType() {
      return StatementType[+this.$route.query.fromStatementType];
    },
    createStatementType() {
      return StatementType[+this.$route.query.createStatementType];
    },
    createStatementTypeName() {
      return this.$t(
        "statementType." + this.firstSymbolToLowerCase(this.createStatementType)
      );
    },
    fromStatementTypeName() {
      return this.$t(
        "statementType." + this.firstSymbolToLowerCase(this.fromStatementType)
      );
    }
  },
  methods: {
    successedSaved(statement) {
      this.$router.replace(
        `/agency/statements/${
          StatementType[+this.$route.query.fromStatementType]
        }/${statement.id}`
      );
    },
    firstSymbolToLowerCase(str) {
      let newStr = str[0].toLowerCase() + str.slice(1);
      return newStr;
    },
    async successedSavedRealEstate(data) {
      this.currentData.realEstateId = data.id;
      await this.$refs["realEstatePopup"].close();
      this.confirmed = true;
    }
  },
  async asyncData({ $axios, query }) {
    let statementType = StatementType[+query.fromStatementType];
    let typeToLowerCase =
      statementType[0].toLowerCase() + statementType.slice(1);
    const { data: statement } = await $axios.get(
      `${dataApi.statements[typeToLowerCase]}/${+query.statementId}`
    );
    const { data: realEstate } = await $axios.get(
      `${dataApi.realEstate}/${+statement.realEstateId}`
    );
    statement.index = null;
    const notify =
      StatementType[+query.createStatementType] === StatementType[0] &&
      realEstate.realEstateType === RealEstateType.Land;
    return {
      currentData: statement,
      notify
    };
  },
  async mounted() {
    if (this.notify) {
      const result = await this.$refs["confirmationPopup"].open();

      if (result) {
        await this.$refs["realEstatePopup"].open();
      }
    }
    this.confirmed = true;
  }
});
</script>
