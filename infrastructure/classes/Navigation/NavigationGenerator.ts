import { PermissionControler } from "~/infrastructure/classes/PermissionControler"
import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { AgencyBlock } from "~/infrastructure/classes/navigation/AgencyBlock";
import { AdministrationBlock } from "~/infrastructure/classes/navigation/AdministrationBlock";
import { TerritorialUnitBlock } from "~/infrastructure/classes/navigation/TerritorialUnitBlock";
import { RealEstateBlock } from "~/infrastructure/classes/navigation/RealEstateBlock";
import { CaseBlock } from "~/infrastructure/classes/navigation/CaseBlock";
import { HistoryBlock } from "~/infrastructure/classes/navigation/HistoryBlock";
import { ElasticSearchBlock } from "~/infrastructure/classes/navigation/ElasticSearchBlock";
import { ArchiveBlock } from "~/infrastructure/classes/navigation/ArchiveBlock";
import { ReportBlock } from "~/infrastructure/classes/navigation/ReportBlock";
import { MigrationBlock } from "~/infrastructure/classes/navigation/MigrationBlock"


export class NavigationGenerator {
  items: IBaseNavigation[]
  constructor() {
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) {
    if (PermissionControler.agencyAccess(filteredClaims)) {
      const agencyBlock = new AgencyBlock()
      agencyBlock.generateItemsByClaims(filteredClaims)
      this.items.push(agencyBlock)
    }

    if (filteredClaims.hasOwnProperty("TerritorialUnit")) {
      const territorialUnitBlock = new TerritorialUnitBlock()
      territorialUnitBlock.generateItemsByClaims(filteredClaims)
      this.items.push(territorialUnitBlock)
    }

    if (filteredClaims.hasOwnProperty("RealEstate")) {
      const realEstateBlock = new RealEstateBlock()
      realEstateBlock.generateItemsByClaims(filteredClaims)
      this.items.push(realEstateBlock)
    }

    if (filteredClaims.hasOwnProperty("Case")) {
      const caseBlock = new CaseBlock()
      caseBlock.generateItemsByClaims(filteredClaims)
      this.items.push(caseBlock)
    }

    if (PermissionControler.administrationAccess(filteredClaims)) {
      const administrationBlock = new AdministrationBlock()
      administrationBlock.generateItemsByClaims(filteredClaims)
      this.items.push(administrationBlock)
    }

    if (filteredClaims.hasOwnProperty("Search")) {
      const elasticSearch = new ElasticSearchBlock()
      elasticSearch.generateItemsByClaims(filteredClaims)
      this.items.push(elasticSearch)
    }

    if (
      filteredClaims.hasOwnProperty("Archive") ||
      filteredClaims.hasOwnProperty("TransmissionJournal")
    ) {
      const archiveBlock = new ArchiveBlock()
      archiveBlock.generateItemsByClaims(filteredClaims)
      this.items.push(archiveBlock)
    }

    if (
      filteredClaims.hasOwnProperty("Report") ||
      filteredClaims.hasOwnProperty("ReportTable")
    ) {
      const reportBlock = new ReportBlock()
      reportBlock.generateItemsByClaims(filteredClaims)
      this.items.push(reportBlock)
    }

    if (filteredClaims.hasOwnProperty("History")) {
      const historyBlock = new HistoryBlock()
      historyBlock.generateItemsByClaims(filteredClaims)
      this.items.push(historyBlock)
    }
    
    if (filteredClaims.hasOwnProperty("Migration")) {
      const migrationBlock = new MigrationBlock()
      migrationBlock.generateItemsByClaims(filteredClaims)
      this.items.push(migrationBlock)
    }
  }
}
