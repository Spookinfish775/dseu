import moment from "moment"
import { ILegalAidStatement } from '~/infrastructure/interfaces/agency/statements/ILegalAidStatement';

import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"

export class LegalAidStatement implements ILegalAidStatement {
  note: string
  shortDescription: string
  organizationId: number | null
  letterSenderOrganizationId: number | null
  applicantStatements: IApplicantStatements[]
  applicants: IApplicant[]
  enteredStatementDate: Date | string
  constructor(payload?: ILegalAidStatement) {
    this.note = payload?.note || ""
    this.shortDescription = payload?.shortDescription || ""
    this.organizationId = payload?.organizationId || null
    this.letterSenderOrganizationId = payload?.letterSenderOrganizationId || null
    this.applicantStatements = payload?.applicantStatements || []
    this.applicants = payload?.applicants || []
    this.enteredStatementDate = payload?.enteredStatementDate || moment(new Date()).format();
  }
}