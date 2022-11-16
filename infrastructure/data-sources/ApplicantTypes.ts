import Vue from "vue"
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";


function ApplicantTypes(context: Vue) {
    return [
        { id: ApplicantType.Individual, name: context.$t("applicantType.individual") },
        { id: ApplicantType.LegalEntity, name: context.$t("applicantType.legalEntity") },
        { id: ApplicantType.LetterSenderOrganization, name: context.$t("applicantType.letterSenderOrganization") },
    ];
}


export { ApplicantTypes }