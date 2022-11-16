import { IRepresentativeDocuments } from "~/infrastructure/interfaces/IRepresentativeDocuments"


export interface IApplicantStatements {
  statementApplicantStatus: number
  applicantId: number
  part: string
  representativeDocuments: IRepresentativeDocuments[]
}
