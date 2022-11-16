export interface IUser {
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
}
