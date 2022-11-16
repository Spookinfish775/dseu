<template>
  <div>
    <DxDataGrid
      height="80vh"
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
      @row-dbl-click="caseRowDblClick"
      @toolbar-preparing="toolbarPreparing"
    >
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxGrouping :auto-expand-all="false" />
      <DxColumnChooser :enabled="true" />
      <DxColumnFixing :enabled="true" />
      <DxSearchPanel position="after" :visible="true" />
      <DxScrolling mode="virtual" />
      <DxPaging :enabled="true" :page-size="10" />
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
        :file-name="$t('navigation.caseBlock.title')"
      />
      <DxStateStoring :enabled="true" type="localStorage" storage-key="case" />
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        :useIcons="true"
        mode="row"
      />

      <DxColumn
        data-field="caseNumber"
        data-type="string"
        :caption="$t('labels.caseNumber')"
      />
      <DxColumn
        data-field="branchId"
        data-type="number"
        :group-index="1"
        :caption="$t('labels.branch')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="branchDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="realEstateId"
        data-type="number"
        :caption="$t('labels.realEstate')"
      >
        <DxLookup
          value-expr="id"
          display-expr="address"
          :data-source="realEstateDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="caseRealEstateType"
        data-type="number"
        :caption="$t('labels.realEstateType')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="realEstateTypeDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="archiveStatus"
        data-type="number"
        :caption="$t('labels.archiveStatus')"
      >
        <DxLookup
          value-expr="id"
          display-expr="name"
          :data-source="archiveStatusDataSource"
        />
      </DxColumn>
      <DxColumn
        data-field="enteredOpenDate"
        data-type="date"
        :caption="$t('labels.openDate')"
      />
      <DxColumn
        data-field="closeDate"
        data-type="date"
        :caption="$t('labels.closeDate')"
      />

      <DxColumn :width="160" :buttons="editButtons" type="buttons" />
      <DocumentEditorPopup
        v-model="documentEditorVisible"
        :data="documentEditorData"
      />

      <DxMasterDetail :enabled="true" template="masterDetailTemplate" />
      <template #masterDetailTemplate="{ data }">
        <MasterDetailTemplate :case="data.data" />
      </template>
      <BasePopup
        ref="realEstatePopup"
        width="70vw"
        height="70vh"
        :show-title="true"
        :title="$t('navigation.realEstate.title')"
      >
        <RealEstateCard :data="currentRealEstate" :readOnly="true" />
      </BasePopup>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import {
  DxSearchPanel,
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxRequiredRule,
  DxStateStoring,
  DxMasterDetail,
  DxFilterRow,
  DxLookup,
  DxPaging,
  DxHeaderFilter,
  DxGrouping,
  DxGroupPanel,
  DxExport,
  DxColumnChooser,
  DxColumnFixing
} from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";

import BasePopup from "~/components/page/popup.vue";
import RealEstateCard from "~/components/realEstate/realEstate-card.vue";
import MasterDetailTemplate from "./master-detail-template.vue";

import { CaseBookTypes } from "~/infrastructure/data-sources/CaseBooksTypes";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { RealEstateTypes } from "~/infrastructure/data-sources/RealEstateTypes";
import { ArchiveStatuses } from "~/infrastructure/data-sources/ArchiveStatuses";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { RowType } from "~/infrastructure/enums/RowType";

export default Vue.extend({
  components: {
    DxSearchPanel,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling,
    DxRequiredRule,
    DxStateStoring,
    DxMasterDetail,
    DxFilterRow,
    DxLookup,
    DxPaging,
    DxHeaderFilter,
    DxGrouping,
    DxGroupPanel,
    DxExport,
    DxColumnChooser,
    DxColumnFixing,
    MasterDetailTemplate,
    RealEstateCard,
    BasePopup
  },
  props: {
    registrationStatementId: {
      type: Number
    }
  },
  data() {
    return {
      branchDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.organization
      }),
      realEstateDataSource: this.$dxStore({
        key: "id",
        loadUrl: this.$dataApi.realEstate
      }),
      realEstateTypeDataSource: RealEstateTypes(this),
      archiveStatusDataSource: ArchiveStatuses(this),
      currentRealEstate: null,
      documentEditorVisible: false,
      documentEditorData: null
    };
  },
  computed: {
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"]["Case"];
      return PermissionControler.canUpdate(permission);
    },
    canCreate() {
      let permission: number = this.$store.getters["user/claims"]["Case"];
      return PermissionControler.canCreate(permission);
    },
    fullAccess() {
      let permission: number = this.$store.getters["user/claims"]["Case"];
      return PermissionControler.fullAccess(permission);
    },
    caseBookTypes() {
      return CaseBookTypes(this);
    },
    dataSource() {
      if (this.registrationStatementId) {
        return new DataSource({
          store: this.$dxStore({
            key: "id",
            loadUrl: `${this.$dataApi.case}/RegistrationService/${this.registrationStatementId}`
          })
        });
      } else {
        return new DataSource({
          store: this.$dxStore({
            key: "id",
            loadUrl: this.$dataApi.case
          })
        });
      }
    },
    editButtons() {
      return [
        {
          hint: this.$t("labels.officialDocuments"),
          icon: "doc",
          onClick: e => {
            let options = {
              loadUrl: `${this.$dataApi.uploadedDocument}/case/${e.row.data.id}`
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
            if (e.row.data.realEstateId === this.currentRealEstate?.id) {
              this.$refs["realEstatePopup"].open();
            } else {
              this.$awn.asyncBlock(
                this.$axios.get(
                  `${this.$dataApi.realEstate}/${e.row.data.realEstateId}`
                ),
                e => {
                  this.currentRealEstate = e.data;
                  this.$refs["realEstatePopup"].open();
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
            this.$router.push(`/realEstate/${e.row.data.realEstateId}`);
          }
        },
        {
          hint: this.$t("buttons.print"),
          icon: "print",
          onClick: e => {
            this.$awn.asyncBlock(
              this.$axios.get(`${this.$dataApi.getHtml.case}/${e.row.data.id}`),
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
        },
        {
          hint: this.$t("buttons.download"),
          icon: "download",
          onClick: e => {
            DocumentLoader.load(this, {
              loadUrl: `${this.$dataApi.download.case}/${e.row.data.id}`,
              name: `${this.$t("navigation.caseBlock.title")} : ${
                e.row.data.caseNumber
              }.docx`
            });
          }
        }
      ];
    }
  },
  methods: {
    caseRowDblClick(e) {
      if (e.rowType === RowType.data) {
        this.$router.push(`/case/book/${e.data.id}`);
      }
    },
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh"
          },
          onClick: () => {
            this.$router.push(`/case/book`);
            this.dataSource.reload();
          }
        },
        ...e.toolbarOptions.items
      ];
    }
  }
});
</script>
