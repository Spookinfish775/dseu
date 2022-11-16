import { LocaleMessageObject } from 'vue-i18n/types'
import administration from "./administration/index"
import agency from "./agency/index"
import caseBlock from "./case/index"
import elasticSearch from "./elasticSearch/index"
import archive from "./archive/index"
import reports from "./report/index"
import migration from "./migration/index"


const messages: LocaleMessageObject = {
  history: {
    title: "Taryh",
    description: "Ulgamda ähli üýtgemeleriň taryhy",
  },
  report: {
    title: " Hasabat",
    description: "Gullugyň hasabatlary ",
  },
  territorialUnit: {
    title: "Ilatly nokat",
    description: "Ilatly nokatlary goşmak/aýyrmak",
    createTerritorialUnitTitle: "Ilatly nokat döretmek",
  },
  realEstate: {
    title: "Gozgalmaýan emläk",
    description: "Gozgalmaýan emläkleri goşmak/aýyrmak",
    createRealEstateTitle: "Gozgalmaýan emlägi döretmek",
  },

  archive,
  administration,
  agency,
  caseBlock,
  elasticSearch,
  reports,
  migration,
}
export default messages;


