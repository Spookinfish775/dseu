import { ISuspendService } from "~/infrastructure/interfaces/agency/services/ISuspendService";

export class SuspendService implements ISuspendService {
  suspendStatementId: number
  whoTook: string
  enteredServiceDate: Date
  constructor(payload?: ISuspendService) {
    this.suspendStatementId = payload?.suspendStatementId || null
    this.whoTook = payload?.whoTook || ""
    this.enteredServiceDate = payload?.enteredServiceDate || new Date()
  }
}