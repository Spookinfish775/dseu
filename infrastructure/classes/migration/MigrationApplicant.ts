import { IMigrationApplicant } from '~/infrastructure/interfaces/migration/IMigrationApplicant';
import { IIdentityDocument } from '~/infrastructure/interfaces/IIdentityDocument';
import { IRepresentativeDocuments } from "~/infrastructure/interfaces/IRepresentativeDocuments"
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";
import { IdentityDocument } from "~/infrastructure/classes/IdentityDocument"
import { Status } from "~/infrastructure/enums/Status"

export class MigrationApplicant implements IMigrationApplicant {
    id: number
    applicantType: number | null
    name: string
    firstName: string
    lastName: string
    middleName: string
    gender: number
    nationId: number
    address: string
    birthday: string
    isNotFullBirthDate: boolean
    shortBirthDate: string
    deathDate: string
    isNotFullDeathDate: boolean
    shortDeathDate: string
    placeOfBirth: string
    citizenshipId: number | null
    registration: string
    tin: string
    status: number
    isRepresentative: boolean
    identityDocument: IIdentityDocument
    representativeDocuments: IRepresentativeDocuments[]
    fullInformation: string
    constructor(payload?: IMigrationApplicant) {
        this.id = payload?.id || null
        this.firstName = payload?.firstName || ""
        this.lastName = payload?.lastName || ""
        this.middleName = payload?.middleName || ""
        this.gender = payload?.gender || null
        this.nationId = payload?.nationId || null
        this.address = payload?.address || ""
        this.placeOfBirth = payload?.placeOfBirth || ""
        this.registration = payload?.registration || ""
        this.tin = payload?.tin || ""
        this.name = payload?.name || ""
        this.isRepresentative = payload?.isRepresentative || false
        this.applicantType = payload?.applicantType || ApplicantType.Individual
        this.birthday = payload?.birthday || null
        this.isNotFullBirthDate = payload?.isNotFullBirthDate || false
        this.shortBirthDate = payload?.shortBirthDate || ""
        this.deathDate = payload?.deathDate || null
        this.isNotFullDeathDate = payload?.isNotFullDeathDate || false
        this.shortDeathDate = payload?.shortDeathDate || ""
        this.citizenshipId = payload?.citizenshipId || null
        this.status = payload?.status || Status.Active
        this.identityDocument = payload?.identityDocument || new IdentityDocument()
        this.representativeDocuments = payload?.representativeDocuments || []
        this.fullInformation = payload?.fullInformation || ""
    }
}