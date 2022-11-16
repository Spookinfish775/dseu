import { IRegion } from '~/infrastructure/interfaces/administration/IRegion';
import { Status } from "~/infrastructure/enums/Status"

export class Region implements IRegion {
    name: string
    status: number
    constructor(payload?: IRegion) {
        this.name = payload?.name || ""
        this.status = payload?.status || Status.Active
    }
}