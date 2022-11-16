import Vue from "vue"
import { EncumbranceType } from "~/infrastructure/enums/EncumbranceType";


function EncumbranceTypes(context: Vue) {
    return [
        { id: EncumbranceType.None, name: context.$t("encumbranceType.none") },
        { id: EncumbranceType.Forced, name: context.$t("encumbranceType.forced") },
        { id: EncumbranceType.Voluntary, name: context.$t("encumbranceType.voluntary") },
    ];
}


export { EncumbranceTypes }