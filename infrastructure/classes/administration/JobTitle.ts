import { IJobTitle } from '~/infrastructure/interfaces/administration/IJobTitle';
import { Status } from "~/infrastructure/enums/Status"

export class JobTitle implements IJobTitle {
    name: string
    status: number
    constructor(payload?: IJobTitle) {
        this.name = payload?.name || ""
        this.status = payload?.status || Status.Active
    }
}