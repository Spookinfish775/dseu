import { IApplicantStatements } from '~/infrastructure/interfaces/IApplicantStatements';
import { IRepresentativeDocuments } from '~/infrastructure/interfaces/IRepresentativeDocuments';
import { RepresentativeType } from "~/infrastructure/enums/RepresentativeType";

export class ApplicantStatements implements IApplicantStatements {
  statementApplicantStatus: number
  applicantId: number
  part: string
  representativeDocuments: IRepresentativeDocuments[]
  constructor(payload?: IApplicantStatements) {
    this.part = payload?.part || ""
    this.statementApplicantStatus = payload?.statementApplicantStatus || RepresentativeType.Owner
    this.applicantId = payload?.applicantId || null
    this.representativeDocuments = payload?.representativeDocuments || []
  }
}