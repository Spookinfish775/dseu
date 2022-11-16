import Vue from "vue"
import { Permission } from "~/infrastructure/enums/Permission";



function Permissions(context: Vue) {
    return [
        { id: Permission.Read, name: context.$t("permission.read") },
        { id: Permission.Create, name: context.$t("permission.create") },
        { id: Permission.Update, name: context.$t("permission.update") },
        { id: Permission.FullAccess, name: context.$t("permission.fullAccess") }
    ];
}


export { Permissions }