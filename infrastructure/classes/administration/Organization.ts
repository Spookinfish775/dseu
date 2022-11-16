import { IOrganization } from '~/infrastructure/interfaces/administration/IOrganization';
import { Status } from "~/infrastructure/enums/Status"

export class Organization implements IOrganization {
  name: string
  status: number
  parentId: number
  regionId: number
  departmentCode: number
  branchCode: number
  organizationType: number
  districtsId: number[]
  constructor(payload?: IOrganization) {
    this.name = payload?.name || ""
    this.status = payload?.status || Status.Active
    this.parentId = payload?.parentId || null
    this.regionId = payload?.regionId || null
    this.departmentCode = payload?.departmentCode || null
    this.branchCode = payload?.branchCode || null
    this.organizationType = payload?.organizationType || null
    this.districtsId = payload?.districtsId || []
  }
}