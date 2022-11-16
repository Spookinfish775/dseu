import moment from "moment"
import { IGiveInformationStatement } from '~/infrastructure/interfaces/agency/statements/IGiveInformationStatement';

import { IApplicantStatements } from "~/infrastructure/interfaces/IApplicantStatements"
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"
import { IApplicant } from "~/infrastructure/interfaces/IApplicant"

export class GiveInformationStatement implements IGiveInformationStatement {
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
  constructor(payload?: IGiveInformationStatement) {
    this.note = payload?.note || ""
    this.realEstateId = payload?.realEstateId || null
    this.requestedDocument = payload?.requestedDocument || ""
    this.requestInformation = payload?.requestInformation || null
    this.registrationServiceId = payload?.registrationServiceId || null
    this.letterSenderOrganizationId = payload?.letterSenderOrganizationId || null
    this.applicantStatements = payload?.applicantStatements || []
    this.applicants = payload?.applicants || []
    this.acceptedDocuments = payload?.acceptedDocuments || []
    this.enteredStatementDate = payload?.enteredStatementDate || moment(new Date()).format();
    this.extractIndex = payload?.extractIndex || ""
  }
}
