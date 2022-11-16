import Vue from "vue"
import { StatementType } from "~/infrastructure/enums/StatementType";


function StatementTypes(context: Vue) {
    return [
        { id: StatementType.RegistrationStatement, name: context.$t("statementType.registrationStatement"), icon: "/icons/navigation/registrationStatementIcon.svg" },
        { id: StatementType.SuspendStatement, name: context.$t("statementType.suspendStatement"), icon: "/icons/navigation/suspendStatementIcon.svg" },
        { id: StatementType.ChangeStatement, name: context.$t("statementType.changeStatement"), icon: "/icons/navigation/changeStatementIcon.svg" },
        { id: StatementType.GiveInformationStatement, name: context.$t("statementType.giveInformationStatement"), icon: "/icons/navigation/giveInformationStatementIcon.svg" },
        { id: StatementType.ConfirmationStatement, name: context.$t("statementType.confirmationStatement"), icon: "/icons/navigation/legalAidStatementIcon.svg" },
        { id: StatementType.LegalAidStatement, name: context.$t("statementType.legalAidStatement"), icon: "/icons/navigation/confirmationStatementIcon.svg" },
    ];
}


export { StatementTypes }