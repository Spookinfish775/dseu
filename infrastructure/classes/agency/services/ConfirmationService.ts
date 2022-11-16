import { IConfirmationService } from "~/infrastructure/interfaces/agency/services/IConfirmationService";

export class ConfirmationService implements IConfirmationService {
  confirmationStatementId: number
  registrationServices: number[]
  foundAddresses: string
  enteredServiceDate: Date
  constructor(payload?: IConfirmationService) {
    this.confirmationStatementId = payload?.confirmationStatementId || null
    this.registrationServices = payload?.registrationServices || []
    this.foundAddresses = payload?.foundAddresses || ''
    this.enteredServiceDate = payload?.enteredServiceDate || new Date()
  }
}