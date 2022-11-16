export interface IAcceptedDocuments {
    officialDocumentType: number
    officialDocumentNameId: number
    number: string
    issueDataTime: string
    issuer: string,
    description: string
    fullInformation: string
    condition: string
    isNotLawGivible: boolean
    cost: number
    currencyId: number
    receivedOfficialDocumentType: number
    receivedOfficialDocumentCopiesCount: number
}
