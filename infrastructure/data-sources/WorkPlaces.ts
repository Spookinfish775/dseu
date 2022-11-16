import Vue from "vue"
import { WorkplaceType } from "~/infrastructure/enums/WorkplaceType";


function WorkPlaces(context: Vue) {
    return [
        { id: WorkplaceType.Agency, name: context.$t("labels.agency") },
        { id: WorkplaceType.Department, name: context.$t("labels.department") },
        { id: WorkplaceType.Branch, name: context.$t("labels.branch") }
    ];
}


export { WorkPlaces }