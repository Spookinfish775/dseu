import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";

export class CaseBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "caseBlock"
    this.path = "/case"
    this.title = "navigation.caseBlock.title"
    this.description = "navigation.caseBlock.description"
    this.icon = "caseBlockIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) {
    
    // if (PermissionControler.canCreate(filteredClaims["RealEstate"])) {
      let caseBook = new BaseNavigation({ name: "case.caseBook", path: `${this.path}/caseBook`, title: "navigation.caseBlock.caseBookTitle", description: "navigation.caseBlock.caseBookDescription", visible: false })
      this.items.push(caseBook)
    // }
  }
}
