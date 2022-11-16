import Vue from "vue"
import { CaseBookType } from "~/infrastructure/enums/CaseBookType";


function CaseBookTypes(context: Vue) {
  return [
    { id: CaseBookType.CaseRealEstateType, name: context.$t("caseBookType.caseRealEstateType") },
    { id: CaseBookType.EncumbranceChapter, name: context.$t("caseBookType.encumbranceChapter") },
    { id: CaseBookType.DealChapter, name: context.$t("caseBookType.dealChapter") },
    { id: CaseBookType.ChangeChapter, name: context.$t("caseBookType.changeChapter") },
    { id: CaseBookType.ChangeChapterTwo, name: context.$t("caseBookType.changeChapterTwo") },
    { id: CaseBookType.Invertory, name: context.$t("caseBookType.invertoryChapter") },
    { id: CaseBookType.Title, name: context.$t("caseBookType.titleChapter") },
  ];
}


export { CaseBookTypes }