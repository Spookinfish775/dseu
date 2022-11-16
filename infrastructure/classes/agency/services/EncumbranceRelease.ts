import { IEncumbranceRelease } from '~/infrastructure/interfaces/agency/services/IEncumbranceRelease';
import { IAcceptedDocuments } from "~/infrastructure/interfaces/IAcceptedDocuments"

export class EncumbranceRelease implements IEncumbranceRelease {
  encumbranceLetterId: number
  officialDocuments?: IAcceptedDocuments[]
  constructor(payload?: IEncumbranceRelease) {
    this.encumbranceLetterId = payload?.encumbranceLetterId || null
    this.officialDocuments = payload?.officialDocuments || []
  }
}