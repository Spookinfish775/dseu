import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"


export interface IChangeStatement {
  note: string
  realEstateId: number | null
  lawId: number | null
  changeDescription: string
  changeCondition: string
  letterSenderOrganizationId: number | null
  applicantStatements: IApplicantStatements[]
  applicants: IApplicant[]
  acceptedDocuments: IAcceptedDocuments[]
  enteredStatementDate: Date | string
}
