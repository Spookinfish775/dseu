import { IUser } from '~/infrastructure/interfaces/administration/IUser';
import { Status } from "~/infrastructure/enums/Status"

export class User implements IUser {
    login: string
    firstName: string
    lastName: string
    middleName: string
    dateOfBirth: string
    phone: string
    email: string
    note: string
    roleId: string
    status: number
    dateOfAppointment: string | null
    dateOfDismissal: string | null
    constructor(user?: IUser) {
        this.login = user?.login || ""
        this.firstName = user?.firstName || ""
        this.lastName = user?.lastName || ""
        this.middleName = user?.middleName || ""
        this.dateOfBirth = user?.dateOfBirth || ""
        this.phone = user?.phone || ""
        this.email = user?.email || ""
        this.note = user?.note || ""
        this.dateOfAppointment = user?.dateOfAppointment || null
        this.dateOfDismissal = user?.dateOfDismissal || null
        this.roleId = user?.roleId || null
        this.status = user?.status || Status.Active
    }
}