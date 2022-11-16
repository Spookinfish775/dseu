import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";

export class HistoryBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "history"
    this.path = "/history"
    this.title = "navigation.history.title"
    this.description = "navigation.history.description"
    this.icon = "historyIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) { }
}
