import { IAcceptedDocuments } from '~/infrastructure/interfaces/IAcceptedDocuments';
import { OfficialDocumentType } from "~/infrastructure/enums/agency/OfficialDocumentType"
import { ReceivedOfficialDocumentType } from "~/infrastructure/enums/ReceivedOfficialDocumentType"
export class AcceptedDocuments implements IAcceptedDocuments {
    officialDocumentType: number
    officialDocumentNameId: number
    number: string
    issueDataTime: string
    issuer: string
    description: string
    fullInformation: string
    condition: string
    isNotLawGivible: boolean
    cost: number
    currencyId: number
    receivedOfficialDocumentType: number
    receivedOfficialDocumentCopiesCount: number
    constructor(payload?: IAcceptedDocuments) {
        this.officialDocumentType = payload?.officialDocumentType || OfficialDocumentType.OfficialDocument
        this.officialDocumentNameId = payload?.officialDocumentNameId || null
        this.number = payload?.number || ""
        this.issueDataTime = payload?.issueDataTime || null
        this.issuer = payload?.issuer || ""
        this.description = payload?.description || ""
        this.fullInformation = payload?.fullInformation || ""
        this.condition = payload?.condition || ""
        this.isNotLawGivible = payload?.isNotLawGivible || false
        this.cost = payload?.cost || null
        this.currencyId = payload?.currencyId || null
        this.receivedOfficialDocumentType = payload?.receivedOfficialDocumentType || ReceivedOfficialDocumentType.Copy
        this.receivedOfficialDocumentCopiesCount = payload?.receivedOfficialDocumentCopiesCount || 1
    }
}