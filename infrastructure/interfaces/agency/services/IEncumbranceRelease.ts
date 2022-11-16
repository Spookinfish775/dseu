import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"

export interface IEncumbranceRelease {
  encumbranceLetterId: number
  officialDocuments?: IAcceptedDocuments[]
}
