import { ICertificateReceiver } from '~/infrastructure/interfaces/ICertificateReceiver';

export class CertificateReceiver implements ICertificateReceiver {
  id: number
  registrationServiceId: number
  whoTook: string
  whenTook: Date
  constructor(payload?: ICertificateReceiver) {
    this.id = payload?.id || null
    this.registrationServiceId = payload?.registrationServiceId || null
    this.whoTook = payload?.whoTook || ""
    this.whenTook = payload?.whenTook || new Date()
  }
}