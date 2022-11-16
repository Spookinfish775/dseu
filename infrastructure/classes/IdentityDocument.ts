import { IIdentityDocument } from '~/infrastructure/interfaces/IIdentityDocument';

export class IdentityDocument implements IIdentityDocument {
    number: string
    series: string
    issueDate: string
    expiredDate: string
    issuedBy: string
    identityDocumentTypeId: number | null
    constructor(payload?: IIdentityDocument) {
        this.number = payload?.number || ""
        this.series = payload?.series || ""
        this.issuedBy = payload?.issuedBy || ""
        this.issueDate = payload?.issueDate || null
        this.expiredDate = payload?.expiredDate || null
        this.identityDocumentTypeId = payload?.identityDocumentTypeId || null
    }
}