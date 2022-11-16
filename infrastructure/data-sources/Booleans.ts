import Vue from "vue"
import { Boolean } from "~/infrastructure/enums/Boolean";


function Booleans(context: Vue) {
    return [
        { id: Boolean.True, name: context.$t("boolean.true") },
        { id: Boolean.False, name: context.$t("boolean.false") },
    ];
}


export { Booleans }