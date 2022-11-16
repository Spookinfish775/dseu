import Vue from "vue"

import { StatementType } from "~/infrastructure/enums/StatementType";

import { Tabs } from "./Tabs"
import { Tab } from "./Tabs"


export class TabsGenerator {
  constructor() { }
  static generateRegistrationStatementTabs(context) {
    let tabs = new Tabs()
    tabs.addTab(new Tab({ text: context.$t("labels.statement"), path: "/agency/statements/registrationStatement" }))
    tabs.addTab(new Tab({ text: context.$t("navigation.agency.registrationServiceTitle"), path: "/agency/services/registrationService" }))
    return tabs
  }

  static getItemsByStatementType(context: Vue, statementType) {
    let tabs
    switch (statementType) {
      case StatementType.RegistrationStatement:
        tabs = this.generateRegistrationStatementTabs(context)
        break;
      default:
        break;
    }
    return tabs
  }
}