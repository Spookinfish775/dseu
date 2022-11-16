import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"


export interface ISuspendStatement {
    registrationStatementId: number | null
    letterSenderOrganizationId: number | null
    lawId: number | null
    note: string
    applicantStatements: IApplicantStatements[]
    applicants: IApplicant[]
    acceptedDocuments: IAcceptedDocuments[]
    enteredStatementDate: Date | string
}
