import moment from "moment"
import { IChangeStatement } from '~/infrastructure/interfaces/agency/statements/IChangeStatement';

import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"

export class ChangeStatement implements IChangeStatement {
  note: string
  realEstateId: number | null
  lawId: number | null
  letterSenderOrganizationId: number | null
  changeDescription: string
  changeCondition: string
  applicantStatements: IApplicantStatements[]
  applicants: IApplicant[]
  acceptedDocuments: IAcceptedDocuments[]
  enteredStatementDate: Date | string
  constructor(payload?: IChangeStatement) {
    this.note = payload?.note || ""
    this.realEstateId = payload?.realEstateId || null
    this.lawId = payload?.lawId || null
    this.letterSenderOrganizationId = payload?.letterSenderOrganizationId || null
    this.changeDescription = payload?.changeDescription || ""
    this.changeCondition = payload?.changeCondition || ""
    this.applicantStatements = payload?.applicantStatements || []
    this.applicants = payload?.applicants || []
    this.acceptedDocuments = payload?.acceptedDocuments || []
    this.enteredStatementDate = payload?.enteredStatementDate || moment(new Date()).format();
  }
}