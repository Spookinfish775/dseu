import { ITerritorialUnit } from '~/infrastructure/interfaces/ITerritorialUnit';
import { Status } from "~/infrastructure/enums/Status"

export class TerritorialUnit implements ITerritorialUnit {
    name: string
    fullAddress: string
    typeName: string
    regionId: number
    districtId: number
    parentId: number
    status: number
    constructor(payload?: ITerritorialUnit) {
        this.name = payload?.name || ""
        this.fullAddress = payload?.fullAddress || ""
        this.typeName = payload?.typeName || ""
        this.regionId = payload?.regionId || null
        this.districtId = payload?.districtId || null
        this.parentId = payload?.parentId || null
        this.status = payload?.status || Status.Active
    }
}