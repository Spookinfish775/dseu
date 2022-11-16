import { IOfficialDocumentName } from '~/infrastructure/interfaces/administration/IOfficialDocumentName';
import { Status } from "~/infrastructure/enums/Status"

export class OfficialDocumentName implements IOfficialDocumentName {
    name: string
    status: number
    constructor(payload?: IOfficialDocumentName) {
        this.name = payload?.name || ""
        this.status = payload?.status || Status.Active
    }
}