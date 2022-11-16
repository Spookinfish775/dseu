import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export class TerritorialUnitBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "territorialUnit"
    this.path = "/territorialUnit"
    this.title = "navigation.territorialUnit.title"
    this.description = "navigation.territorialUnit.description"
    this.icon = "territorialUnitIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) {
    if (PermissionControler.canCreate(filteredClaims["TerritorialUnit"])) {
      let territorialUnit = new BaseNavigation({ name: "territorialUnit.createTerritorialUnit", path: `${this.path}/create`, title: "navigation.territorialUnit.createTerritorialUnitTitle", visible: false })
      this.items.push(territorialUnit)
    }
  }
}
