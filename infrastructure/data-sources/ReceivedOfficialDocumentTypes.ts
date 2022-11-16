import Vue from "vue"
import { ReceivedOfficialDocumentType } from "~/infrastructure/enums/ReceivedOfficialDocumentType";



function ReceivedOfficialDocumentTypes(context: Vue) {
  return [
    { id: ReceivedOfficialDocumentType.Original, name: context.$t("receivedOfficialDocumentType.original") },
    { id: ReceivedOfficialDocumentType.Copy, name: context.$t("receivedOfficialDocumentType.copy") },
    { id: ReceivedOfficialDocumentType.OriginalAndCopy, name: context.$t("receivedOfficialDocumentType.originalAndCopy") },
  ];
}


export { ReceivedOfficialDocumentTypes }