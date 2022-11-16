import moment from "moment"
import { IConfirmationStatement } from '~/infrastructure/interfaces/agency/statements/IConfirmationStatement';

import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"

export class ConfirmationStatement implements IConfirmationStatement {
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
  constructor(payload?: IConfirmationStatement) {
    this.note = payload?.note || ""
    this.territory = payload?.territory || ""
    this.familyMembers = payload?.familyMembers || ""
    this.lawId = payload?.lawId || null
    this.letterSenderOrganizationId = payload?.letterSenderOrganizationId || null
    this.organizationId = payload?.organizationId || null
    this.realEstateType = payload?.realEstateType || null
    this.lawId = payload?.lawId || null
    this.applicantStatements = payload?.applicantStatements || []
    this.applicants = payload?.applicants || []
    this.acceptedDocuments = payload?.acceptedDocuments || []
    this.enteredStatementDate = payload?.enteredStatementDate || moment(new Date()).format();
  }
}