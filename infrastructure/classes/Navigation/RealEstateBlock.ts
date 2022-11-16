import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export class RealEstateBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "realEstate"
    this.path = "/realEstate"
    this.title = "navigation.realEstate.title"
    this.description = "navigation.realEstate.description"
    this.icon = "realEstateIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) {

    if (PermissionControler.canCreate(filteredClaims["RealEstate"])) {
      let realEstate = new BaseNavigation({ name: "realEstate.createRealEstate", path: `${this.path}/create`, title: "navigation.realEstate.createRealEstateTitle", visible: false })
      this.items.push(realEstate)
    }
  }
}
