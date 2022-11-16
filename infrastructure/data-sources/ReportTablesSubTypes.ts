import { ReportTableSubType } from "~/infrastructure/enums/ReportTableSubType";


const ReportTablesSubTypes = (context) => [
  { id: ReportTableSubType.Type1, name: context.$t("reportTableSubType.type1") },
  { id: ReportTableSubType.Type2, name: context.$t("reportTableSubType.type2") },
];


export { ReportTablesSubTypes }