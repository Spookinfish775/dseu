import { IRole } from '~/infrastructure/interfaces/administration/IRole';
import { IClaim } from '~/infrastructure/interfaces/administration/IRole';

export class Role implements IRole {
    name: string
    claims: IClaim[]
    constructor(payload?: IRole) {
        this.name = payload?.name || ""
        this.claims = payload?.claims || []
    }
}