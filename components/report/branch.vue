<template>
  <div>
    <DxDataGrid
      height="80vh"
      :data-source="dataSource"
      :show-borders="true"
      :hoverStateEnabled="true"
      :errorRowEnabled="false"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :load-panel="{
        enabled: true,
        indicatorSrc: require('~/static/icons/loading.gif'),
      }"
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
        :file-name="$t('navigation.reports.reportBranch.title')"
      />
      <DxSelection
        select-all-mode="page"
        show-check-boxes-mode="onClick"
        mode="multiple"
      />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="branchReport"
      />

      <DxColumn
        data-field="organizationName"
        data-type="string"
        :caption="$t('navigation.reports.reportBranch.organizationName')"
      />
      <DxColumn
        data-field="registrationStatementCount"
        data-type="number"
        :caption="
          $t('navigation.reports.reportBranch.registrationStatementCount')
        "
      />
      <DxColumn
        data-field="givenFromThemBlank"
        data-type="number"
        :caption="$t('navigation.reports.reportBranch.givenFromThemBlank')"
      />
      <DxColumn
        data-field="registrationServiceCount"
        data-type="number"
        :caption="
          $t('navigation.reports.reportBranch.registrationServiceCount')
        "
      />
      <DxColumn
        data-field="refusalServiceCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBranch.refusalServiceCount')"
      />
      <DxColumn
        data-field="giveInformationServiceCount"
        data-type="number"
        :caption="
          $t('navigation.reports.reportBranch.giveInformationServiceCount')
        "
      />
      <DxColumn
        data-field="confirmationServiceCount"
        data-type="number"
        :caption="
          $t('navigation.reports.reportBranch.confirmationServiceCount')
        "
      />
      <DxColumn
        data-field="legalAidServiceCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBranch.legalAidServiceCount')"
      />
      <DxColumn
        data-field="changeServiceCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBranch.changeServiceCount')"
      />
      <DxColumn
        data-field="suspendServiceCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBranch.suspendServiceCount')"
      />
      <DxColumn
        data-field="encumrenceForcedCount"
        data-type="number"
        :caption="$t('navigation.reports.reportBranch.encumrenceForcedCount')"
      />
      <DxColumn
        data-field="encubranceVoluntaryCount"
        data-type="number"
        :caption="
          $t('navigation.reports.reportBranch.encubranceVoluntaryCount')
        "
      />
      <DxColumn
        data-field="govermentDutySum"
        data-type="number"
        :caption="$t('navigation.reports.reportBranch.govermentDutySum')"
      />
      <DxColumn
        :caption="$t('navigation.reports.reportBranch.reportByUserDtos.title')"
      >
        <DxColumn
          data-field="userFullName"
          data-type="string"
          :caption="
            $t('navigation.reports.reportBranch.reportByUserDtos.userFullName')
          "
        />
        <DxColumn
          data-field="registrationStatementCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.registrationStatementCount'
            )
          "
        />
        <DxColumn
          data-field="givenFromThemBlank"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.givenFromThemBlank'
            )
          "
        />
        <DxColumn
          data-field="registrationServiceCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.registrationServiceCount'
            )
          "
        />
        <DxColumn
          data-field="refusalServiceCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.refusalServiceCount'
            )
          "
        />
        <DxColumn
          data-field="giveInformationServiceCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.giveInformationServiceCount'
            )
          "
        />
        <DxColumn
          data-field="confirmationServiceCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.confirmationServiceCount'
            )
          "
        />
        <DxColumn
          data-field="legalAidServiceCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.legalAidServiceCount'
            )
          "
        />
        <DxColumn
          data-field="changeServiceCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.changeServiceCount'
            )
          "
        />
        <DxColumn
          data-field="suspendServiceCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.suspendServiceCount'
            )
          "
        />
        <DxColumn
          data-field="encumrenceForcedCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.encumrenceForcedCount'
            )
          "
        />
        <DxColumn
          data-field="encubranceVoluntaryCount"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.encubranceVoluntaryCount'
            )
          "
        />
        <DxColumn
          data-field="govermentDutySum"
          data-type="number"
          :caption="
            $t(
              'navigation.reports.reportBranch.reportByUserDtos.govermentDutySum'
            )
          "
        />
      </DxColumn>
      <template #dataFilter>
        <DataFilter
          @startDateChanged="startDateChanged"
          @endDateChanged="endDateChanged"
        />
      </template>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import moment from "moment";
import {
  DxDataGrid,
  DxSearchPanel,
  DxColumn,
  DxLabel,
  DxEditing,
  DxScrolling,
  DxStateStoring,
  DxSelection,
  DxRequiredRule,
  DxFilterRow,
  DxPaging,
  DxLookup,
  DxHeaderFilter,
  DxGrouping,
  DxGroupPanel,
  DxExport,
  DxColumnChooser,
  DxColumnFixing,
} from "devextreme-vue/data-grid";

import DataSource from "devextreme/data/data_source";

import DataFilter from "./components/data-filter.vue";

import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
export default Vue.extend({
  components: {
    DxDataGrid,
    DxSearchPanel,
    DxColumn,
    DxLabel,
    DxEditing,
    DxScrolling,
    DxStateStoring,
    DxSelection,
    DxRequiredRule,
    DxFilterRow,
    DxPaging,
    DxLookup,
    DxHeaderFilter,
    DxGrouping,
    DxGroupPanel,
    DxExport,
    DxColumnChooser,
    DxColumnFixing,
    DataFilter,
  },
  data() {
    moment.locale('en');
    return {
      startDate: moment(new Date()).format("L").replaceAll("/", "."),
      endDate: moment(new Date()).format("L").replaceAll("/", "."),
      statusDataSource: Statuses(this),
    };
  },
  computed: {
    dataSource() {
      return new DataSource({
        store: this.$dxStore({
          key: "registrationStatementCount",
          loadUrl: `${this.$dataApi.reportByBranch}?StartDate=${this.startDate}&EndDate=${this.endDate}`,
        }),
      });
    },
  },
  methods: {
    startDateChanged($event) {
      this.startDate = moment($event).format("L").replaceAll("/", ".");
    },
    endDateChanged($event) {
      this.endDate = moment($event).format("L").replaceAll("/", ".");
    },
    toolbarPreparing(e) {
      e.toolbarOptions.items = [
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh",
          },
          onClick: () => {
            this.dataSource.reload();
          },
        },
        ...e.toolbarOptions.items,
        {
          template: "dataFilter",
          location: "after",
        },
      ];
    },
  },
});
</script>

