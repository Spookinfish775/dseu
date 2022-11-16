import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";

export class ElasticSearchBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "elasticSearch"
    this.path = "/elasticSearch"
    this.title = "navigation.elasticSearch.title"
    this.description = "navigation.elasticSearch.description"
    this.icon = "elasticSearchIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) { }
}
