import { IDistrict } from '~/infrastructure/interfaces/administration/IDistrict';
import { Status } from "~/infrastructure/enums/Status"

export class District implements IDistrict {
    name: string
    regionId: number | null
    status: number
    constructor(payload?: IDistrict) {
        this.name = payload?.name || ""
        this.regionId = payload?.regionId || null
        this.status = payload?.status || Status.Active
    }
}