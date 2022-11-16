import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"

export interface ILegalAidStatement {
  note: string
  shortDescription: string
  organizationId: number | null
  letterSenderOrganizationId: number | null
  applicantStatements: IApplicantStatements[]
  applicants: IApplicant[]
  enteredStatementDate: Date | string
}