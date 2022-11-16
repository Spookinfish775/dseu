import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export class MigrationBlock implements IBaseNavigation {
  name: string;
  path: string;
  title: string;
  description?: string;
  icon?: string;
  visible: boolean = true;
  items: IBaseNavigation[];
  constructor() {
    this.name = "migration";
    this.path = "/migration";
    this.title = "navigation.migration.title";
    this.description = "navigation.migration.description";
    this.icon = "migrationIcon.svg";
    this.items = [];
  }
  generateItemsByClaims(filteredClaims: IClaim) {

    // if (filteredClaims.hasOwnProperty("UserRegistration")) {
    // let statements = new BaseNavigation({ name: "migration.data", path: `${this.path}/data`, title: "navigation.agency.statementsTitle", description: "navigation.agency.statementsDescription", icon: "statementsIcon.svg", visible: true })
    // if (PermissionControler.canCreate(filteredClaims["UserRegistration"])) {
    // let createStatements = new BaseNavigation({ name: "agency.createStatements", path: `${this.path}/statements/create`, title: "navigation.agency.createStatementsTitle", visible: true })
    // statements.addItem(createStatements)
    // createStatements.addItem(new BaseNavigation({ name: "agency.createRegistrationStatement", path: `${this.path}/statements/registrationStatement/create`, title: "navigation.agency.registrationStatementTitle", description: "navigation.agency.registrationStatementDescription", icon: "registrationStatementIcon.svg", visible: true }))
    // createStatements.addItem(new BaseNavigation({ name: "agency.createSuspendStatement", path: `${this.path}/statements/suspendStatement/create`, title: "navigation.agency.suspendStatementTitle", description: "navigation.agency.suspendStatementDescription", icon: "suspendStatementIcon.svg", visible: true }))
    // createStatements.addItem(new BaseNavigation({ name: "agency.createChangeStatement", path: `${this.path}/statements/changeStatement/create`, title: "navigation.agency.changeStatementTitle", description: "navigation.agency.changeStatementDescription", icon: "changeStatementIcon.svg", visible: true }))
    // createStatements.addItem(new BaseNavigation({ name: "agency.createGiveInformationStatement", path: `${this.path}/statements/giveInformationStatement/create`, title: "navigation.agency.giveInformationStatementTitle", description: "navigation.agency.giveInformationStatementDescription", icon: "giveInformationStatementIcon.svg", visible: true }))
    // createStatements.addItem(new BaseNavigation({ name: "agency.createLegalAidStatement", path: `${this.path}/statements/legalAidStatement/create`, title: "navigation.agency.legalAidStatementTitle", description: "navigation.agency.legalAidStatementDescription", icon: "legalAidStatementIcon.svg", visible: true }))
    // createStatements.addItem(new BaseNavigation({ name: "agency.createConfirmationStatement", path: `${this.path}/statements/confirmationStatement/create`, title: "navigation.agency.confirmationStatementTitle", description: "navigation.agency.confirmationStatementDescription", icon: "confirmationStatementIcon.svg", visible: true }))
    // // }
    // this.items.push(statements)
    // }
    let migrationBook = new BaseNavigation({ name: "migration.migrationBook", path: `${this.path}/migrationBook`, title: "navigation.migration.migrationBookTitle", description: "navigation.migration.migrationBookDescription", visible: false })
      this.items.push(migrationBook)
  }
}