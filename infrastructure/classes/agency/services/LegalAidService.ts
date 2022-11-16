import { ILegalAidService } from "~/infrastructure/interfaces/agency/services/ILegalAidService";

export class LegalAidService implements ILegalAidService {
  legalAidStatementId: number
  enteredServiceDate: Date
  constructor(payload?: ILegalAidService) {
    this.legalAidStatementId = payload?.legalAidStatementId || null
    this.enteredServiceDate = payload?.enteredServiceDate || new Date()
  }
}