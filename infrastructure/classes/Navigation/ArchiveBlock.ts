import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";

export class ArchiveBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "archive"
    this.path = "/archive"
    this.title = "navigation.archive.title"
    this.description = "navigation.archive.description"
    this.icon = "archiveIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) {
    if (filteredClaims.hasOwnProperty("Archive")) {
    let archive = new BaseNavigation({ name: "archive.archive", path: `${this.path}/archive`, title: "navigation.archive.title", description: "navigation.archive.description", icon: "archiveIcon.svg", visible: false })
    this.items.push(archive)
    }
    if (filteredClaims.hasOwnProperty("TransmissionJournal")) {
    let transmissionJournal = new BaseNavigation({ name: "archive.transmissionJournal", path: `${this.path}/transmissionJournal`, title: "navigation.archive.transmissionJournalTitle", description: "navigation.archive.transmissionJournalDescription", icon: "transmissionJournalIcon.svg", visible: false })
    this.items.push(transmissionJournal)
    }
  }
}
