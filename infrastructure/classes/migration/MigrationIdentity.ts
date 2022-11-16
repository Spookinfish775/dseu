import { IMigrationIdentityDocument } from '~/infrastructure/interfaces/migration/IMigrationIdentityDocument';

export class MigrationIdentity implements IMigrationIdentityDocument {
  number?: string
  series?: string
  issueDate?: string
  expiredDate?: string
  issuedBy?: string
  identityDocumentTypeId?: number | null
  constructor(payload?: IMigrationIdentityDocument) {
    this.number = payload?.number || ""
    this.series = payload?.series || ""
    this.issuedBy = payload?.issuedBy || ""
    this.issueDate = payload?.issueDate || null
    this.expiredDate = payload?.expiredDate || null
    this.identityDocumentTypeId = payload?.identityDocumentTypeId || null
  }


  static generateCurrectlyIdentityDocument(payload) {
    return {
      issuedissueDateBy: payload?.identityDocumentIssueDate || null,
      issuedBy: payload?.identityDocumentIssuedBy || "",
      number: payload?.identityDocumentNumber|| "",
      series: payload?.identityDocumentSeries|| "",
      identityDocumentTypeId: payload?.identityDocumentTypeName|| null
    }
  }
}