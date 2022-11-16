export interface IReceipt {
  number: string
  sum: number
}

export interface IPayment {
  prepaymentId: number
  receipts: IReceipt[]
}
