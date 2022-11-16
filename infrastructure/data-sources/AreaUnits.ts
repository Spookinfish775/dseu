
import Vue from "vue"
import { AreaUnit } from "~/infrastructure/enums/AreaUnit";

function AreaUnits(context: Vue) {
  return [
    { id: AreaUnit.m2, name: context.$t("areaUnit.m2") },
    { id: AreaUnit.a, name: context.$t("areaUnit.a") },
    { id: AreaUnit.ha, name: context.$t("areaUnit.ha") },
    { id: AreaUnit.km2, name: context.$t("areaUnit.km2") },
  ];
}


export { AreaUnits }