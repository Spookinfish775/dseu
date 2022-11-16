import { IChangeService } from "~/infrastructure/interfaces/agency/services/IChangeService";

export class ChangeService implements IChangeService {
  changeStatementId: number
  caseBookId: number
  changedDescription: string
  enteredServiceDate: Date
  constructor(payload?: IChangeService) {
    this.changeStatementId = payload?.changeStatementId || null
    this.caseBookId = payload?.caseBookId || null
    this.changedDescription = payload?.changedDescription || ""
    this.enteredServiceDate = payload?.enteredServiceDate || new Date()
  }
}