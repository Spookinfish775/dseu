export interface IRefusalService {
  registrationStatementId: number
  refusalType: number
  note: string
  enteredServiceDate: Date
  refusalReasons: number[]
  refusalLaws: number[]
}
