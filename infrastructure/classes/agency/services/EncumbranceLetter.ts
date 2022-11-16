import { IEncumbranceLetter } from '~/infrastructure/interfaces/agency/services/IEncumbranceLetter';
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"

export class EncumbranceLetter implements IEncumbranceLetter {
  applicant: string
  note: string
  encumbranceId: number
  realEstateId: number
  officialDocuments: IAcceptedDocuments[]
  constructor(payload?: IEncumbranceLetter) {
    this.applicant = payload?.applicant || ""
    this.note = payload?.note || ""
    this.encumbranceId = payload?.encumbranceId || null
    this.realEstateId = payload?.realEstateId || null
    this.officialDocuments = payload?.officialDocuments || []
  }
}