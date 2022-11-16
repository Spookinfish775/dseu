import Vue from "vue"
import { OfficialDocumentType } from "~/infrastructure/enums/agency/OfficialDocumentType";


function OfficialDocumentTypes(context: Vue) {
  return [
    { id: OfficialDocumentType.OfficialDocument, name: context.$t("officialDocumentType.officialDocument") },
    { id: OfficialDocumentType.Deal, name: context.$t("officialDocumentType.deal") }
  ];
}


export { OfficialDocumentTypes }