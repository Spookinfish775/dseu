import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export class ReportBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "report"
    this.path = "/report"
    this.title = "navigation.report.title"
    this.description = "navigation.report.description"
    this.icon = "reportIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) {
    if (filteredClaims.hasOwnProperty("Report")) {
      let reports = new BaseNavigation({ name: "report", path: `${this.path}`, title: "navigation.reports.title", description: "navigation.reports.description", icon: "reports.svg", visible: true })
      reports.addItem(new BaseNavigation({ name: "report.allUser", path: `${this.path}/allUser`, title: "navigation.reports.reportAllUser.title", description: "navigation.reports.reportAllUser.description", visible: true }))
      reports.addItem(new BaseNavigation({ name: "report.blank", path: `${this.path}/blank`, title: "navigation.reports.reportBlank.title", description: "navigation.reports.reportBlank.description", visible: true }))
      reports.addItem(new BaseNavigation({ name: "report.branch", path: `${this.path}/branch`, title: "navigation.reports.reportBranch.title", description: "navigation.reports.reportBranch.description", visible: true }))
      reports.addItem(new BaseNavigation({ name: "report.duty", path: `${this.path}/duty`, title: "navigation.reports.reportDuty.title", description: "navigation.reports.reportDuty.description", visible: true }))
      reports.addItem(new BaseNavigation({ name: "report.notification", path: `${this.path}/notification`, title: "navigation.reports.reportNotification.title", description: "navigation.reports.reportNotification.description", visible: true }))
      this.items.push(reports)
    }

    if (filteredClaims.hasOwnProperty("ReportTable")) {
      let reportsTable = new BaseNavigation({ name: "reportTable", path: `${this.path}/reportTable`, title: "navigation.reports.reportTable.title", description: "navigation.reports.reportTable.description", icon: "reportsByTypes.svg", visible: true })
      this.items.push(reportsTable)
    }

    if (filteredClaims.hasOwnProperty("ReportTable")) {
      let dashBoard = new BaseNavigation({ name: "dashboard", path: `${this.path}/dashboard`, title: "navigation.reports.reportDashboard.title", description: "navigation.reports.reportDashboard.description", icon: "reportsByTypes.svg", visible: true })
      this.items.push(dashBoard)
    }

    if (filteredClaims.hasOwnProperty("ReportTable")) {
      let registrationServiceExel = new BaseNavigation({ name: "registrationServiceExel", path: `${this.path}/registrationServiceExel`, title: "navigation.reports.registrationServiceExel.title", description: "navigation.reports.registrationServiceExel.description", icon: "reportsByTypes.svg", visible: true })
      this.items.push(registrationServiceExel)
    }
  }
}
