<template>
  <DxDataGrid
    :data-source="dataSource"
    :show-borders="true"
    height="80vh"
    :remote-operations="true"
    :allow-column-reordering="true"
    :allow-column-resizing="true"
    :column-auto-width="true"
    @row-dbl-click="rowDblClick"
  >
    <DxPaging :enabled="true" :page-size="10" />
    <DxExport
      :enabled="true"
      :allow-export-selected-data="true"
      :file-name="$t('labels.subType')"
    />
    <DxEditing :useIcons="true" mode="row" />

    <DxColumn
      data-field="title"
      data-type="string"
      :caption="$t('labels.name')"
    />
    <DxColumn
      data-field="type"
      data-type="string"
      :caption="$t('labels.type')"
    />
    <DxColumn
      data-field="url"
      data-type="string"
      :caption="$t('labels.startDate')"
    />
    <DxColumn
      data-field="uri"
      data-type="string"
      :caption="$t('labels.endDate')"
    >
    </DxColumn>
    >
    <DxColumn :editor-options="columnEditorOptions" />
    <DxColumn :width="100" :buttons="editButtons" type="buttons" />
  </DxDataGrid>
</template>
<script>
import DataSource from "devextreme/data/data_source";
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxStateStoring,
  DxRequiredRule,
  DxPaging,
  DxLookup,
  DxExport,
} from "devextreme-vue/data-grid";
import PageHeader from "~/components/page/page-header.vue";

export default {
  components: {
    DxDataGrid,
    PageHeader,
    DxColumn,
    DxDataGrid,
    DxEditing,
    DxStateStoring,
    DxRequiredRule,
    DxPaging,
    DxLookup,
    DxExport,
  },
  data() {
    return {
      dataSource: new DataSource({
        store: this.$dxStore({
          key: "id",
          loadUrl: this.$dataApi.dashBoard,
          insertUrl: this.$dataApi.dashBoard,
          removeUrl: this.$dataApi.dashBoard,
          updateUrl: this.$dataApi.dashBoard,
        }),
      }),
      columnEditorOptions: { width: 100 },
    };
  },
  async mounted() {
    let { data } = await this.$axios.get(this.$dataApi.dashBoard);
    console.log(data);
    let address = data + "/api/search";
  },
  computed: {
    editButtons() {
      return [
        {
          hint: this.$t("labels.detail"),
          icon: "info",
          onClick: async (e) => {
            const host = await this.$axios.get("/api/Report/getGrafnaHost");
            let address = host.data + e.row.data.url;
            window.open(address, "_blank");
          },
        },
      ];
    },
  },
  methods: {
    async rowDblClick(e) {
      const host = await this.$axios.get("/api/Report/getGrafnaHost");
      let address = host.data + e.data.url;
      window.open(address, "_blank");
    },
    rowUpdating(e) {
      e.newData = Object.assign(e.oldData, e.newData);
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
      ];
    },
  },
};
</script>
