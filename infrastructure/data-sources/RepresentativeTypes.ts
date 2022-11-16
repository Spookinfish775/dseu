import Vue from "vue"
import { RepresentativeType } from "~/infrastructure/enums/RepresentativeType"

function RepresentativeTypes(context: Vue) {
  return [
    { id: RepresentativeType.None, name: context.$t("representativeType.none") },
    { id: RepresentativeType.Owner, name: context.$t("representativeType.owner") },
    { id: RepresentativeType.Representative, name: context.$t("representativeType.representative") },
    { id: RepresentativeType.Heir, name: context.$t("representativeType.heir") },
    { id: RepresentativeType.OtherSide, name: context.$t("representativeType.otherSide") },
  ]
}

export { RepresentativeTypes }