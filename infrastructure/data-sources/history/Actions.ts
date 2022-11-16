import Vue from "vue"
import { Action } from "~/infrastructure/enums/history/Action";



function Actions(context: Vue) {
    return [
        { id: Action.Insert, name: context.$t("history.actions.insert") },
        { id: Action.Update, name: context.$t("history.actions.update") },
        { id: Action.Delete, name: context.$t("history.actions.delete") },
    ];
}


export { Actions }