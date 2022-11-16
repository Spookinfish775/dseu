import { IBooks } from '~/infrastructure/interfaces/IBooks';
import { Status } from "~/infrastructure/enums/Status"

export class Books implements IBooks {
  bookType: number
  name: string
  status: number
  number: number
  branchId: number
  constructor(payload?: IBooks) {
    this.name = payload?.name || ""
    this.bookType = payload?.bookType || null
    this.number = payload?.number || null
    this.branchId = payload?.branchId || null
    this.status = payload?.status || Status.Active
  }
}