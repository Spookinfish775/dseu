import { IRealEstateMission } from '~/infrastructure/interfaces/administration/IRealEstateMission';
import { Status } from "~/infrastructure/enums/Status"

export class RealEstateMission implements IRealEstateMission {
    name: string
    status: number
    constructor(payload?: IRealEstateMission) {
        this.name = payload?.name || ""
        this.status = payload?.status || Status.Active
    }
}