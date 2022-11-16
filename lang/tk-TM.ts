import { LocaleMessageObject } from 'vue-i18n/types'
import navigation from "./navigation/index"
import buttons from "./buttons"
import history from "./history"
import labels from "./labels"
import notifications from "./notifications/index"
import errors from "./errors/index"
import territorialUnit from './territorialUnit'
import registrationStatement from './registrationStatement'
import statementType from './statementType'
import enums from "./enums/index"
import agency from './agency'
import elasticSearch from './elasticSearch'
import documentEditor from './documentEditor/index'
import migration from './migration'
import scanner from './scanner'
import help from './help'


const messages: LocaleMessageObject = {
  notifications,
  errors,
  agency,
  elasticSearch,
  history,
  navigation,
  buttons,
  labels,
  territorialUnit,
  registrationStatement,
  statementType,
  documentEditor,
  migration,
  scanner,
  help,
  ...enums,
}
export default messages;
