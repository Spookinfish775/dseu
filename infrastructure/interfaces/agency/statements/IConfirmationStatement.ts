import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"


export interface IConfirmationStatement {
  note: string
  territory: string
  familyMembers: string
  lawId: number | null
  organizationId: number | null
  realEstateType: number | null
  letterSenderOrganizationId: number | null
  applicantStatements: IApplicantStatements[]
  applicants: IApplicant[]
  acceptedDocuments: IAcceptedDocuments[]
  enteredStatementDate: Date | string
}
