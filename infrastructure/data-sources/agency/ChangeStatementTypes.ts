import Vue from "vue"
import { ChangeStatementType } from "~/infrastructure/enums/agency/ChangeStatementType";


function ChangeStatementTypes(context: Vue) {
  return [
    { id: ChangeStatementType.Gornus_36, name: context.$t("changeStatementType.gornus_36") },
    { id: ChangeStatementType.Gornus_37, name: context.$t("changeStatementType.gornus_37") }
  ];
}


export { ChangeStatementTypes }