import Vue from "vue"
import { NotificationType } from "~/infrastructure/enums/agency/NotificationType";


function NotificationTypes(context: Vue) {
    return [
        { id: NotificationType.Gornush_44, name: context.$t("notificationType.gornush_44") },
        { id: NotificationType.Gornush_45, name: context.$t("notificationType.gornush_45") },
        { id: NotificationType.Gornush_49, name: context.$t("notificationType.gornush_49") },
        { id: NotificationType.Gornush_50, name: context.$t("notificationType.gornush_50") },
        { id: NotificationType.Gornush_84, name: context.$t("notificationType.gornush_84") },
    ];
}


export { NotificationTypes }
