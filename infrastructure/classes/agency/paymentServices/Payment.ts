import { IPayment } from '~/infrastructure/interfaces/agency/paymentServices/IPayment';
import { IReceipt } from '~/infrastructure/interfaces/agency/paymentServices/IPayment';


export class Receipt implements IReceipt {
  number: string
  sum: number
  constructor(payload?: IReceipt) {
    this.number = payload?.number || null
    this.sum = payload?.sum || null
  }
}

export class Payment implements IPayment {
  prepaymentId: number
  receipts: IReceipt[]
  constructor(payload?: IPayment) {
    this.prepaymentId = payload?.prepaymentId || null
    this.receipts = payload?.receipts || []
  }
}
