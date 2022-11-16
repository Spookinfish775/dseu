import { INotification } from '~/infrastructure/interfaces/agency/notification/INotification';


export class Notification implements INotification {
  outgoingNumber: string
  outgoingDate: string
  letterSenderOrganizationId: number
  serviceId: number
  statementId: number
  constructor(payload?: INotification) {
    this.outgoingNumber = payload?.outgoingNumber || ""
    this.outgoingDate = payload?.outgoingDate || ""
    this.letterSenderOrganizationId = payload?.letterSenderOrganizationId || null
    this.serviceId = payload?.serviceId || null
    this.statementId = payload?.statementId || null
  }
}