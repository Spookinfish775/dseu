import Vue from "vue"
import { Gender } from "~/infrastructure/enums/Gender"

function Genders(context: Vue) {
  return [
    { id: Gender.Male, name: context.$t("gender.male") },
    { id: Gender.Female, name: context.$t("gender.female") },
  ]
}

export { Genders }