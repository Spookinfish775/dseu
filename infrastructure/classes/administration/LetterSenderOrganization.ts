import { ILetterSenderOrganization } from '~/infrastructure/interfaces/administration/ILetterSenderOrganization';
import { IIdentityDocument } from '~/infrastructure/interfaces/IIdentityDocument';
import { IRepresentativeDocuments } from "~/infrastructure/interfaces/IRepresentativeDocuments"
import { IdentityDocument } from "~/infrastructure/classes/IdentityDocument"
import { Status } from "~/infrastructure/enums/Status"

export class LetterSenderOrganization implements ILetterSenderOrganization {
  name: string
  legalAddress: string
  postAddress: string
  phones: string
  email: string
  webSite: string
  note: string
  nonresident: boolean
  isRepresentative: boolean
  status: number
  letterSenderOrganizationTypeId: number
  constructor(payload?: ILetterSenderOrganization) {
    this.name = payload?.name
    this.legalAddress = payload?.legalAddress || ""
    this.postAddress = payload?.postAddress || ""
    this.phones = payload?.phones || ""
    this.email = payload?.email || ""
    this.webSite = payload?.webSite || ""
    this.note = payload?.note || ""
    this.status = payload?.status || Status.Active
    this.nonresident = payload?.nonresident || false
    this.isRepresentative = payload?.isRepresentative || false
    this.letterSenderOrganizationTypeId = payload?.letterSenderOrganizationTypeId || null
  }
}