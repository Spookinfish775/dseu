import { IEmploymentWorkplaceOrder } from '~/infrastructure/interfaces/administration/IEmploymentWorkplaceOrder';
import { Status } from "~/infrastructure/enums/Status"

export class EmploymentWorkplaceOrder implements IEmploymentWorkplaceOrder {
  name: string
  fullInformation: string
  number: string
  issueDataTime: string
  issuer: string
  note: string
  status: number
  constructor(payload?: IEmploymentWorkplaceOrder) {
    this.name = payload?.name || ""
    this.fullInformation = payload?.fullInformation || ""
    this.number = payload?.number || ""
    this.issueDataTime = payload?.issueDataTime || ""
    this.issuer = payload?.issuer || ""
    this.note = payload?.note || ""
    this.status = payload?.status || Status.Active
  }
}