import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"


export interface IGiveInformationStatement {
  note: string
  realEstateId: number | null
  requestedDocument: string
  requestInformation: number | null
  registrationServiceId: number | null
  letterSenderOrganizationId: number | null
  applicantStatements: IApplicantStatements[]
  applicants: IApplicant[]
  acceptedDocuments: IAcceptedDocuments[]
  enteredStatementDate: Date | string
  extractIndex: string
}
