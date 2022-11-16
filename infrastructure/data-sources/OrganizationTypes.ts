import Vue from "vue"
import { OrganizationType } from "~/infrastructure/enums/OrganizationType";


function OrganizationTypes(context: Vue) {
    return [
        { id: OrganizationType.Agency, name: context.$t("organizationType.agency") },
        { id: OrganizationType.Department, name: context.$t("organizationType.department") },
        { id: OrganizationType.Branch, name: context.$t("organizationType.branch") }
    ];
}


export { OrganizationTypes }