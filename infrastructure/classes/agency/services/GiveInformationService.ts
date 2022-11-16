import { IGiveInformationService } from "~/infrastructure/interfaces/agency/services/IGiveInformationService";

export class GiveInformationService implements IGiveInformationService {
  giveInformationStatementId: number
  blankId: number
  enteredServiceDate: Date
  extractIndex: string
  constructor(payload?: IGiveInformationService) {
    this.giveInformationStatementId = payload?.giveInformationStatementId || null
    this.blankId = payload?.blankId || null
    this.enteredServiceDate = payload?.enteredServiceDate || new Date()
    this.extractIndex = payload?.extractIndex
  }
}
