import Vue from "vue"
import { RefusalType } from "~/infrastructure/enums/agency/RefusalType";


function RefusalTypes(context: Vue) {
  return [
    { id: RefusalType.Reject, name: context.$t("refusalType.reject") },
    { id: RefusalType.RealEstateReject, name: context.$t("refusalType.realEstateReject") },
    { id: RefusalType.Denied, name: context.$t("refusalType.denied") }
  ];
}


export { RefusalTypes }