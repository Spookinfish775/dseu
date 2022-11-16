import { IRegistrationService } from "~/infrastructure/interfaces/agency/services/IRegistrationService";

export class RegistrationService implements IRegistrationService {
  index: number
  registrationStatementId: number
  blankId: number
  note: string
  enteredServiceDate: Date
  certificateIndex: string
  registrationServiceNumber: string
  realEstatePartId:number
  constructor(payload?: IRegistrationService) {
    this.index = payload?.index || null
    this.registrationStatementId = payload?.registrationStatementId || null
    this.blankId = payload?.blankId || null
    this.note = payload?.note || ""
    this.enteredServiceDate = payload?.enteredServiceDate || new Date()
    this.realEstatePartId = payload?.realEstatePartId || null
    this.certificateIndex = payload?.certificateIndex || ""
    this.registrationServiceNumber = payload?.registrationServiceNumber || ""
  }
}