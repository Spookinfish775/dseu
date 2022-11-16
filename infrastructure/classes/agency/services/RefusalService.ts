import { IRefusalService } from '~/infrastructure/interfaces/agency/services/IRefusalService';

export class RefusalService implements IRefusalService {
  registrationStatementId: number
  refusalType: number
  note: string
  enteredServiceDate: Date
  refusalReasons: number[]
  refusalLaws: number[]
  constructor(payload?: IRefusalService) {
    this.registrationStatementId = payload?.registrationStatementId || null
    this.refusalType = payload?.refusalType || null
    this.note = payload?.note || ""
    this.enteredServiceDate = payload?.enteredServiceDate || new Date()
    this.refusalReasons = payload?.refusalReasons || []
    this.refusalLaws = payload?.refusalLaws || []
  }
}