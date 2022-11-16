import Vue from "vue"
import { RealEstateType } from "~/infrastructure/enums/RealEstateType";



function RealEstateTypes(context: Vue) {
    return [
        { id: RealEstateType.Land, name: context.$t("realEstateType.land") },
        { id: RealEstateType.Building, name: context.$t("realEstateType.building") },
        { id: RealEstateType.Complex, name: context.$t("realEstateType.complex") },
        { id: RealEstateType.Flat, name: context.$t("realEstateType.flat") },
    ];
}


export { RealEstateTypes }