import { IStamp } from "~/infrastructure/interfaces/IStamp";

export class Stamp implements IStamp {
  number: number
  userId: string
  organizationId: number
  constructor(payload?: IStamp) {
    this.number = payload?.number || null
    this.userId = payload?.userId || ""
    this.organizationId = payload?.organizationId || null
  }
}