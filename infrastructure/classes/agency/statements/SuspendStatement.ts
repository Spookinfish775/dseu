import moment from "moment"
import { ISuspendStatement } from '~/infrastructure/interfaces/agency/statements/ISuspendStatement';

import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"

export class SuspendStatement implements ISuspendStatement {
    registrationStatementId: number | null
    lawId: number | null
    note: string
    letterSenderOrganizationId: number | null
    applicantStatements: IApplicantStatements[]
    acceptedDocuments: IAcceptedDocuments[]
    applicants: IApplicant[]
    enteredStatementDate: Date | string
    constructor(payload?: ISuspendStatement) {
        this.note = payload?.note || ""
        this.lawId = payload?.lawId || null
        this.registrationStatementId = payload?.registrationStatementId || null
        this.letterSenderOrganizationId = payload?.letterSenderOrganizationId || null
        this.applicantStatements = payload?.applicantStatements || []
        this.applicants = payload?.applicants || []
        this.acceptedDocuments = payload?.acceptedDocuments || []
        this.enteredStatementDate = payload?.enteredStatementDate || moment(new Date()).format();
    }
}