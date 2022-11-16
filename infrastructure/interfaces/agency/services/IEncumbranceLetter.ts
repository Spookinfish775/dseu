import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"

export interface IEncumbranceLetter {
  applicant: string
  note: string
  encumbranceId: number
  realEstateId: number
  officialDocuments: IAcceptedDocuments[]
}
