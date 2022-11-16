export interface IPrepayment {
  isUrgent: boolean
  hasTehnicalService: boolean
  applicantType?: number
  statementId?: number
  governmentDutyId?: number
  agencyPaymentServicesId?: number[]
}
