import Vue from "vue"
import { LawPeriodType } from "~/infrastructure/enums/LawPeriodType";


function LawPeriodTypes(context: Vue) {
    return [
        { id: LawPeriodType.Day, name: context.$t("lawPeriodType.day") },
        { id: LawPeriodType.Month, name: context.$t("lawPeriodType.month") },
        { id: LawPeriodType.Year, name: context.$t("lawPeriodType.year") },
    ];
}


export { LawPeriodTypes }