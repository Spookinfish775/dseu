,<template>
  <div>
    <DxTagBox
      ref="tag-box"
      :data-source="dataSource"
      :value.sync="componentValue"
      :buttons="buttons"
      :search-enabled="true"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
      :show-selection-controls="true"
      :read-only="readOnly"
      apply-value-mode="useButtons"
    />
    <BasePopup
      ref="basePopup"
      width="70%"
      height="80vh"
      :show-title="true"
      :title="$t('navigation.agency.statementsTitle')"
      :drag-enabled="false"
      :close-on-outside-click="true"
    >
      <ElasticGrid selectable @select="onSelect" />
    </BasePopup>
  </div>
</template>

<script>
import DxTagBox from "devextreme-vue/tag-box";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import ElasticGrid from "~/components/elasticSearch/data-grid.vue";

export default {
  components: {
    DxTagBox,
    BasePopup,
    ElasticGrid
  },
  props: {
    value: {
      default: () => []
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
    filter: {
      type: Array,
      default: null
    },
    confirmationStatementId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      componentValue: this.value,
      filteredServices: []
    };
  },
  computed: {
    superFilter() {
      let filter = [];
      if (this.confirmationStatementId) {
        this.filteredServices.forEach((el, index) => {
          filter.push(["id", "=", el.id]);
          if (index + 1 != this.filteredServices.length) {
            filter.push("or");
          }
        });
      }
      if (this.confirmationStatementId && this.filteredServices.length === 0) {
        filter.push(["id", "=", 0]);
      }
      return filter;
    },
    dataSource() {
      let dataSource = new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.services.registrationService
        }),
        filter: this.superFilter
      });
      return dataSource;
    },
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
  watch: {
    componentValue(val) {
      this.$emit("valueChanged", val);
    },
    confirmationStatementId(val) {
      if (val) {
        this.$refs["tag-box"].instance.reset();
        this.getServicesByConfirmationStatement();
      }
    }
  },
  methods: {
    async getServicesByConfirmationStatement() {
      const { data } = await this.$axios.get(
        `${this.$dataApi.services.registrationService}/applicant/${this.confirmationStatementId}`
      );
      this.filteredServices = data.data;
    },
    onSelect(data) {
      this.componentValue.push(data.id);
      this.$refs["tag-box"].instance.repaint();
      this.$refs.basePopup.close();
    }
  }
};
</script>
