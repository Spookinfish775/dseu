import Vue from "vue"
import { EncumbranceProcessType } from "~/infrastructure/enums/EncumbranceProcessType";


function EncumbranceProcessTypes(context: Vue) {
  return [
    { id: EncumbranceProcessType.None, name: context.$t("encumbranceProcessType.none") },
    { id: EncumbranceProcessType.EncumbranceLetter, name: context.$t("encumbranceProcessType.encumbranceLetter") },
    { id: EncumbranceProcessType.Forced, name: context.$t("encumbranceProcessType.forced") },
    { id: EncumbranceProcessType.Voluntary, name: context.$t("encumbranceProcessType.voluntary") },
  ];
}


export { EncumbranceProcessTypes }