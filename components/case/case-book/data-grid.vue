<template>
  <div>
    <DxDataGrid
      :data-source="dataSource"
      :show-borders="true"
      :hoverStateEnabled="true"
      :errorRowEnabled="false"
      :remote-operations="true"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :load-panel="{
        enabled: true,
        indicatorSrc: require('~/static/icons/loading.gif')
      }"
      @toolbar-preparing="toolbarPreparing"
    >
		<DxSearchPanel position="after" :visible="true" />
		   <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
        :file-name="$t('navigation.caseBlock.title')"
      />
			<DxColumnChooser :enabled="true" />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="caseBook"
      />
      <DxScrolling mode="virtual" />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        :useIcons="true"
        mode="row"
      />
      <DxColumn
        data-field="registrationServiceNumber"
        data-type="string"
        :caption="$t('labels.registrationServiceNumber')"
      />
      <DxColumn
        data-field="registrationStatementNumber"
        data-type="string"
        :caption="$t('labels.registrationStatementNumber')"
      />

      <DxColumn :width="150" :buttons="editButtons" type="buttons" />
    </DxDataGrid>
    <TypeSelector ref="typeSelector" :types="caseBookTypes" />
    <DocumentEditorPopup
      v-model="documentEditorVisible"
      :data="documentEditorData"
    />

    <BasePopup
      ref="registrationServicePopup"
      width="70vw"
      height="70vh"
      :show-title="true"
      :title="$t('navigation.agency.registrationServiceTitle')"
    >
      <RegistrationServiceCard
        :data="currentRegistrationService"
        :currentStatement="currentStatement"
        :readOnly="true"
      />
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
	DxSearchPanel,
	DxExport,
	DxColumnChooser,
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxLookup,
  DxRequiredRule,
  DxMasterDetail,
  DxStateStoring
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import DxSelectBox from "devextreme-vue/select-box";
import { DxScrollView } from "devextreme-vue/scroll-view";

import { CaseBookTypes } from "~/infrastructure/data-sources/CaseBooksTypes";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";

import BasePopup from "~/components/page/popup.vue";
import RegistrationServiceCard from "~/components/agency/services/registrationService/registrationService-card.vue";
import TypeSelector from "~/components/layout/type-selector/index.vue";

export default Vue.extend({
  components: {
		DxSearchPanel,
		DxExport,
		DxColumnChooser,
    BasePopup,
    DxScrollView,
    DxMasterDetail,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling,
    DxLookup,
    DxRequiredRule,
    DxStateStoring,
    DxSelectBox,
    RegistrationServiceCard,
    TypeSelector
  },
  props: {
    caseId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentRegistrationService: null,
      currentStatement: null,
      documentEditorVisible: false,
      documentEditorData: null
    };
  },
  computed: {
    dataSource() {
      return new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: `${this.$dataApi.caseBook}/case/${this.caseId}`
        })
      });
    },
    caseBookTypes() {
      return CaseBookTypes(this);
    },
    editButtons() {
      return [
        {
          hint: this.$t("labels.officialDocuments"),
          icon: "doc",
          onClick: e => {
            let options = {
              loadUrl: `${this.$dataApi.uploadedDocument}/caseBook/${e.row.data.id}`
            };
            this.$store.commit("file-manager/OPEN_MANAGER");
            this.$store.commit("file-manager/SET_CURRENT_DOCUMENT", e.row.data);
            this.$store.dispatch("file-manager/loadFiles", options);
          }
        },
        {
          hint: this.$t("labels.detail"),
          icon: "info",
          onClick: e => {
            if (
              e.row.data.registrationServiceId ===
              this.currentRegistrationService?.id
            ) {
              this.$refs["registrationServicePopup"].open();
            } else {
              this.$awn.asyncBlock(
                this.$axios.get(
                  `${this.$dataApi.services.registrationService}/${e.row.data.registrationServiceId}`
                ),

                async e => {
                  this.currentRegistrationService = e.data;
                  const { data } = await this.$axios.get(
                    `${this.$dataApi.statements.registrationStatement}/${+e.data
                      .registrationStatementId}`
                  );
                  this.currentStatement = data;
                  this.$refs["registrationServicePopup"].open();
                },
                e => {
                  this.$awn.alert();
                }
              );
            }
          }
        },
        {
          hint: this.$t("labels.edit"),
          icon: "edit",
          onClick: e => {
            this.$router.push(
              `/agency/services/registrationService/${e.row.data.registrationServiceId}`
            );
          }
        },
        {
          hint: this.$t("buttons.print"),
          icon: "print",
          onClick: async e => {
            let result = await this.$refs["typeSelector"].open();
            if (result) {
              this.$awn.asyncBlock(
                this.$axios.get(`${this.$dataApi.getHtml.caseBook}`, {
                  params: {
                    id: e.row.data.id,
                    caseBookType: result.id
                  }
                }),
                e => {
                  this.$awn.success();
                  this.documentEditorData = e.data;
                  this.documentEditorVisible = true;
                },
                e => {
                  this.$awn.alert();
                }
              );
            }
          }
        },
        {
          hint: this.$t("buttons.download"),
          icon: "download",
          onClick: async e => {
            let result = await this.$refs["typeSelector"].open();
            if (result) {
              this.$awn.asyncBlock(
                DocumentLoader.load(this, {
                  loadUrl: `${this.$dataApi.download.caseBook}?id=${e.row.data.id}&caseBookType=${result.id}`,
                  name: `${this.$t("labels.caseBook")} ${
                    e.row.data.registrationServiceNumber
                  }.docx`
                })
              );
            }
          }
        }
      ];
    }
  },
  methods: {
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh"
          },
          onClick: () => {
            this.uploadData();
          }
        },
        ...e.toolbarOptions.items
      ];
    }
  },
});
</script>
