import { IPrepayment } from '~/infrastructure/interfaces/agency/paymentServices/IPrepayment';
import { ApplicantType } from '~/infrastructure/enums/ApplicantType';

export class Prepayment implements IPrepayment {
  isUrgent: boolean
  hasTehnicalService: boolean
  applicantType: number
  statementId: number
  governmentDutyId: number
  agencyPaymentServicesId: number[]
  constructor(payload?: IPrepayment) {
    this.isUrgent = this.isUrgent || false
    this.hasTehnicalService = this.hasTehnicalService || false
    this.applicantType = payload?.applicantType || ApplicantType.Individual
    this.statementId = payload?.statementId || null
    this.governmentDutyId = payload?.governmentDutyId || null
    this.agencyPaymentServicesId = payload?.agencyPaymentServicesId || null
  }
}