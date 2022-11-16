import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"


export interface IRegistrationStatement {
    index: number | null
    note: string
    realEstateId: number | null
    acceptedDocuments: IAcceptedDocuments[]
    lawId: number | null
    applicantStatements: IApplicantStatements[]
    applicants: IApplicant[]
    letterSenderOrganizationId: number | null
    isDeal: boolean
    conventionalNumber: string
    registrationStatementNumber: string
    oldRealEstateAddress: string
    lawPeriod: number
    lawPeriodType: number
    lawStartDate: Date
    enteredStatementDate: Date | string
}
