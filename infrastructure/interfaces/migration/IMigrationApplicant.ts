import { IIdentityDocument } from "~/infrastructure/interfaces/IIdentityDocument"
import { IRepresentativeDocuments } from "~/infrastructure/interfaces/IRepresentativeDocuments"

export interface IMigrationApplicant {
    id: number
    isRepresentative?: boolean
    applicantType?: number | null
    firstName?: string
    lastName?: string
    address?: string
    middleName?: string
    gender?: number | null
    nationId?: number | null
    birthday?: string
    isNotFullBirthDate?: boolean
    shortBirthDate?: string
    deathDate?: string
    isNotFullDeathDate?: boolean
    shortDeathDate?: string
    placeOfBirth?: string
    citizenshipId?: number | null
    registration?: string
    tin?: string
    name?: string
    status: number
    identityDocument?: IIdentityDocument
    representativeDocuments?: IRepresentativeDocuments[]
    fullInformation: string
}
