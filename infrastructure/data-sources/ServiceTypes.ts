import Vue from "vue"
import { ServiceType } from "~/infrastructure/enums/ServiceType";


function ServiceTypes(context: Vue) {
  return [
    { id: ServiceType.RegistrationService, name: context.$t("serviceType.registrationService"), icon: "/icons/navigation/registrationStatementIcon.svg" },
    { id: ServiceType.ConfirmationService, name: context.$t("serviceType.confirmationService"), icon: "/icons/navigation/confirmationStatementIcon.svg" },
    { id: ServiceType.SuspendService, name: context.$t("serviceType.suspendService"), icon: "/icons/navigation/suspendStatementIcon.svg" },
    { id: ServiceType.ChangeService, name: context.$t("serviceType.changeService"), icon: "/icons/navigation/changeStatementIcon.svg" },
    { id: ServiceType.RefusalService, name: context.$t("serviceType.refusalService"), icon: "deleterow" },
    { id: ServiceType.GiveInformationService, name: context.$t("serviceType.giveInformationService"), icon: "/icons/navigation/giveInformationStatementIcon.svg" },
    { id: ServiceType.LegalAidService, name: context.$t("serviceType.legalAidService"), icon: "/icons/navigation/legalAidStatementIcon.svg" },
  ];
}


export { ServiceTypes }