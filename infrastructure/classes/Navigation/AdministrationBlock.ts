import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";


export class AdministrationBlock implements IBaseNavigation {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  visible: boolean = true
  items: IBaseNavigation[]
  constructor() {
    this.name = "administration"
    this.path = "/administration"
    this.title = "navigation.administration.title"
    this.description = "navigation.administration.description"
    this.icon = "administrationIcon.svg"
    this.items = []
  }
  generateItemsByClaims(filteredClaims: IClaim) {
    if (filteredClaims.hasOwnProperty("User")) {
      let usersDataBookEntry = new BaseNavigation({ name: "administration.usersDataBookEntry", path: `${this.path}/users`, title: "navigation.administration.usersDataBookEntryTitle", description: "navigation.administration.usersDataBookEntryDescription", icon: "usersDataBookEntryIcon.svg", visible: true })
      if (PermissionControler.canCreate(filteredClaims["User"])) {
        usersDataBookEntry.addItem(new BaseNavigation({ name: "administration.createUsers", path: `${this.path}/users/create`, title: "navigation.administration.createUsersTitle", visible: false }))
      }
      usersDataBookEntry.addItem(new BaseNavigation({ name: "administration.jobTitles", path: `${this.path}/jobTitles`, title: "navigation.administration.jobTitlesTitle", description: "navigation.administration.jobTitlesDescription", visible: true }))
      usersDataBookEntry.addItem(new BaseNavigation({ name: "administration.roles", path: `${this.path}/roles`, title: "navigation.administration.rolesTitle", description: "navigation.administration.rolesDescriptions", visible: true }))
      this.items.push(usersDataBookEntry)
      if (filteredClaims.hasOwnProperty("UserWorkplace")) {
        let userWorkplace = new BaseNavigation({ name: "administration.userWorkplace", path: `${this.path}/userWorkplace`, title: "navigation.administration.userWorkplaceTitle", description: "navigation.administration.userWorkplaceDescription", visible: true })
        if (PermissionControler.canCreate(filteredClaims["UserWorkplace"])) {
          userWorkplace.addItem(new BaseNavigation({ name: "administration.createUserWorkplace", path: `${this.path}/userWorkplace/create`, title: "navigation.administration.createUserWorkplaceTitle", visible: false }))
        }
        usersDataBookEntry.addItem(userWorkplace)
      }
    }

    if (filteredClaims.hasOwnProperty("Organization")) {
      let organizationDataBookEntry = new BaseNavigation({ name: "administration.organizationDataBookEntry", path: `${this.path}/organization`, title: "navigation.administration.organizationDataBookEntryTitle", description: "navigation.administration.organizationDataBookEntryDescription", icon: "organizationDataBookEntryIcon.svg", visible: true })
      organizationDataBookEntry.addItem(new BaseNavigation({ name: "administration.createOrganization", path: `${this.path}/organization/create`, title: "navigation.administration.createOrganizationTitle", description: "navigation.administration.createOrganizationDescription", visible: true }))
      if (filteredClaims.hasOwnProperty("LetterSenderOrganization")) {
        let letterSenderOrganization = new BaseNavigation({ name: "administration.letterSenderOrganization", path: `${this.path}/letterSenderOrganization`, title: "navigation.administration.letterSenderOrganizationTitle", description: "navigation.administration.letterSenderOrganizationDescription", visible: true })
        if (PermissionControler.canCreate(filteredClaims["LetterSenderOrganization"])) {
          letterSenderOrganization.addItem(new BaseNavigation({ name: "administration.createLetterSenderOrganization", path: `${this.path}/letterSenderOrganization/create`, title: "navigation.administration.createLetterSenderOrganizationTitle", visible: true }))
        }
        organizationDataBookEntry.addItem(letterSenderOrganization)
        organizationDataBookEntry.addItem(new BaseNavigation({ name: "administration.letterSenderOrganizationType", path: `${this.path}/letterSenderOrganizationType`, title: "navigation.administration.letterSenderOrganizationTypeTitle", description: "navigation.administration.letterSenderOrganizationTypeDescription", visible: true }))
        this.items.push(organizationDataBookEntry)
      }
    }

    if (
      filteredClaims.hasOwnProperty("Region") ||
      filteredClaims.hasOwnProperty("District") ||
      filteredClaims.hasOwnProperty("Citizenship") ||
      filteredClaims.hasOwnProperty("IdentityDocumentType") ||
      filteredClaims.hasOwnProperty("IdentityDocumentSeries") ||
      filteredClaims.hasOwnProperty("RealEstateMission") ||
      filteredClaims.hasOwnProperty("DocumentContent") ||
      filteredClaims.hasOwnProperty("Currency") ||
      filteredClaims.hasOwnProperty("OfficialDocumentName") ||
      filteredClaims.hasOwnProperty("RefusalLaw") ||
      filteredClaims.hasOwnProperty("RefusalReason") ||
      filteredClaims.hasOwnProperty("SpecialApplicantType")
    ) {
      let sharedDirectoryDataBookEntry = new BaseNavigation({ name: "administration.sharedDirectoryDataBookEntry", path: `${this.path}`, title: "navigation.administration.sharedDirectoryDataBookEntryTitle", description: "navigation.administration.sharedDirectoryDataBookEntryDescription", icon: "sharedDirectoryDataBookEntryIcon.svg", visible: true })
      if (filteredClaims.hasOwnProperty("Region")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.region", path: `${this.path}/region`, title: "navigation.administration.regionTitle", description: "navigation.administration.regionDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("District")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.district", path: `${this.path}/district`, title: "navigation.administration.districtTitle", description: "navigation.administration.districtDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("Citizenship")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.citizenship", path: `${this.path}/citizenship`, title: "navigation.administration.citizenshipTitle", description: "navigation.administration.citizenshipDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("Nation")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.nation", path: `${this.path}/nation`, title: "navigation.administration.nationTitle", description: "navigation.administration.nationDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("IdentityDocumentType")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.identityDocumentType", path: `${this.path}/identityDocumentType`, title: "navigation.administration.identityDocumentTypeTitle", description: "navigation.administration.identityDocumentTypeDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("IdentityDocumentSeries")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.identityDocumentSeries", path: `${this.path}/identityDocumentSeries`, title: "navigation.administration.identityDocumentSeriesTitle", description: "navigation.administration.identityDocumentSeriesDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("RealEstateMission")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.realEstateMission", path: `${this.path}/realEstateMission`, title: "navigation.administration.realEstateMissionTitle", description: "navigation.administration.realEstateMissionDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("DocumentContent")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.documentContent", path: `${this.path}/documentContent`, title: "navigation.administration.documentContentTitle", description: "navigation.administration.documentContentDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("Currency")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.currency", path: `${this.path}/currency`, title: "navigation.administration.currencyTitle", description: "navigation.administration.currencyDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("OfficialDocumentName")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.officialDocumentName", path: `${this.path}/officialDocumentName`, title: "navigation.administration.officialDocumentNameTitle", description: "navigation.administration.officialDocumentNameDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("RefusalLaw")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.refusalLaw", path: `${this.path}/refusalLaw`, title: "navigation.administration.refusalLawTitle", description: "navigation.administration.refusalLawDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("RefusalReason")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.refusalReason", path: `${this.path}/refusalReason`, title: "navigation.administration.refusalReasonTitle", description: "navigation.administration.refusalReasonDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("SpecialApplicantType")) {
        sharedDirectoryDataBookEntry.addItem(new BaseNavigation({ name: "administration.specialApplicantType", path: `${this.path}/specialApplicantType`, title: "navigation.administration.specialApplicantTypeTitle", description: "navigation.administration.specialApplicantTypeDescription", visible: true }))
      }
      this.items.push(sharedDirectoryDataBookEntry)
    }

    if (
      filteredClaims.hasOwnProperty("Law") ||
      filteredClaims.hasOwnProperty("BaseAmount") ||
      filteredClaims.hasOwnProperty("GovernmentDuty") ||
      filteredClaims.hasOwnProperty("GovernmentDutyGroup")
    ) {
      let governmentDutyDataBookEntry = new BaseNavigation({ name: "administration.governmentDutyDataBookEntry", path: `${this.path}`, title: "navigation.administration.governmentDutyDataBookEntryTitle", description: "navigation.administration.governmentDutyDataBookEntryDescription", icon: "governmentDutyDataBookEntryIcon.svg", visible: true })
      if (filteredClaims.hasOwnProperty("Law")) {
        governmentDutyDataBookEntry.addItem(new BaseNavigation({ name: "administration.law", path: `${this.path}/law`, title: "navigation.administration.lawTitle", description: "navigation.administration.lawDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("BaseAmount")) {
        governmentDutyDataBookEntry.addItem(new BaseNavigation({ name: "administration.baseAmount", path: `${this.path}/baseAmount`, title: "navigation.administration.baseAmountTitle", description: "navigation.administration.baseAmountDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("GovernmentDuty")) {
        governmentDutyDataBookEntry.addItem(new BaseNavigation({ name: "administration.governmentDuty", path: `${this.path}/governmentDuty`, title: "navigation.administration.governmentDutyTitle", description: "navigation.administration.governmentDutyDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("GovernmentDutyGroup")) {
        governmentDutyDataBookEntry.addItem(new BaseNavigation({ name: "administration.governmentDutyGroup", path: `${this.path}/governmentDutyGroup`, title: "navigation.administration.governmentDutyGroupTitle", description: "navigation.administration.governmentDutyGroupDescription", visible: true }))
      }
      if (filteredClaims.hasOwnProperty("AgencyPaymentService")) {
        governmentDutyDataBookEntry.addItem(new BaseNavigation({ name: "administration.agencyPaymentService", path: `${this.path}/agencyPaymentService`, title: "navigation.administration.agencyPaymentServiceTitle", description: "navigation.administration.agencyPaymentServiceDescription", visible: true }))
      }
      this.items.push(governmentDutyDataBookEntry)
    }
  }
}
