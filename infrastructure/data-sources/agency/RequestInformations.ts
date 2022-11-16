import Vue from "vue"
import { RequestInformation } from "~/infrastructure/enums/agency/RequestInformation";

function RequestInformations(context: Vue) {
  return [
    { id: RequestInformation.ApplicantRealEstateLaw, name: context.$t("requestInformation.applicantRealEstateLaw") },
    { id: RequestInformation.DuplicateBlank, name: context.$t("requestInformation.duplicateBlank") },
    { id: RequestInformation.InformationGivenApplicants, name: context.$t("requestInformation.informationGivenApplicants") },
    { id: RequestInformation.LawTransfer, name: context.$t("requestInformation.lawTransfer") },
    { id: RequestInformation.OfficialDocumentNotation, name: context.$t("requestInformation.officialDocumentNotation") },
    { id: RequestInformation.RealEstate, name: context.$t("requestInformation.realEstate") },
    { id: RequestInformation.RealEstateWithTime, name: context.$t("requestInformation.realEstateWithTime") }, 
  ];
}


export { RequestInformations }