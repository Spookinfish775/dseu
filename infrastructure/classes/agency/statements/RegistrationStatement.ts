import moment from "moment"
import { IRegistrationStatement } from '~/infrastructure/interfaces/agency/statements/IRegistrationStatement';

import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"

export class RegistrationStatement implements IRegistrationStatement {
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
    enteredStatementDate: Date | string
    lawPeriod: number
    lawPeriodType: number
    lawStartDate: Date
    constructor(payload?: IRegistrationStatement) {
        this.index = payload?.index || null
        this.note = payload?.note || ""
        this.realEstateId = payload?.realEstateId || null
        this.acceptedDocuments = payload?.acceptedDocuments || []
        this.lawId = payload?.lawId || null
        this.applicantStatements = payload?.applicantStatements || []
        this.applicants = payload?.applicants || []
        this.letterSenderOrganizationId = payload?.letterSenderOrganizationId || null
        this.isDeal = payload?.isDeal || false
        this.oldRealEstateAddress = payload?.oldRealEstateAddress || ""
        this.conventionalNumber = payload?.conventionalNumber || ""
        this.registrationStatementNumber = payload?.registrationStatementNumber || ""
        this.enteredStatementDate = payload?.enteredStatementDate || moment(new Date()).format();
        this.lawStartDate = payload?.lawStartDate || null
        this.lawPeriod = payload?.lawPeriod || null
        this.lawPeriodType = payload?.lawPeriodType || null
    }
}