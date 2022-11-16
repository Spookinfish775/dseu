import Vue from "vue"
import { ReportTable } from "~/infrastructure/enums/ReportTable";


function ReportTables(context: Vue) {
  return [
    { id: ReportTable.Type01, url: context.$dataApi.reportTable.type01, name: context.$t("reportTable.type01") },
    { id: ReportTable.Type02, url: context.$dataApi.reportTable.type02, name: context.$t("reportTable.type02") },
    { id: ReportTable.Type03, url: context.$dataApi.reportTable.type03, name: context.$t("reportTable.type03") },
    { id: ReportTable.Type04, url: context.$dataApi.reportTable.type04, name: context.$t("reportTable.type04") },
    { id: ReportTable.Type05, url: context.$dataApi.reportTable.type05, name: context.$t("reportTable.type05") },
    { id: ReportTable.Type06, url: context.$dataApi.reportTable.type06, name: context.$t("reportTable.type06") },
    { id: ReportTable.Type33, url: context.$dataApi.reportTable.type33, name: context.$t("reportTable.type33") },
    { id: ReportTable.Type77, url: context.$dataApi.reportTable.type77, name: context.$t("reportTable.type77") },
    { id: ReportTable.Type81, url: context.$dataApi.reportTable.type81, name: context.$t("reportTable.type81") },
  ];
}


export { ReportTables }