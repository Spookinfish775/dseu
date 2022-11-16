import Vue from "vue"
import { LawType } from "~/infrastructure/enums/LawType";


function LawTypes(context: Vue) {
    return [
        { id: LawType.Law, name: context.$t("lawType.law") },
        { id: LawType.Encumbrance, name: context.$t("lawType.encumbrance") },
    ];
}


export { LawTypes }