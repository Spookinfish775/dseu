import { IRealEstate } from '~/infrastructure/interfaces/IRealEstate';
import { Status } from "~/infrastructure/enums/Status"

export class RealEstate implements IRealEstate {
    name: string
    number: string
    address: string
    description: string
    cadastralNumber: string
    virtualCadastralNumber: string
    invertarNumber: string
    cadastralCost: number | null
    caseRealEstateType: number | null
    realEstateMissionId: number | null
    dealCost: number | null
    currencyId: number | null
    territorialUnitId: number | null
    square: number | null
    liveSquare: number | null
    commonSquare: number | null
    flatTotal: number | null
    aboveGroundFloorsCount: number | null
    undergroundFloorsCount: number | null
    flat: number | null
    apartmentNumber: string | null
    roomTotal: number | null
    areaUnits: number | null
    status: number | null
    subdivision: string
    constructor(payload?: IRealEstate) {
        this.name = payload?.name || ""
        this.number = payload?.number || ""
        this.address = payload?.address || ""
        this.description = payload?.description || ""
        this.cadastralNumber = payload?.cadastralNumber || ""
        this.virtualCadastralNumber = payload?.virtualCadastralNumber || ""
        this.invertarNumber = payload?.invertarNumber || ""
        this.cadastralCost = payload?.cadastralCost || null
        this.caseRealEstateType = Number.isInteger(payload?.caseRealEstateType) ? payload?.caseRealEstateType : null
        this.realEstateMissionId = payload?.realEstateMissionId || null
        this.dealCost = payload?.dealCost || null
        this.currencyId = payload?.currencyId || null
        this.territorialUnitId = payload?.territorialUnitId || null
        this.square = payload?.square || null
        this.liveSquare = payload?.liveSquare || null
        this.commonSquare = payload?.commonSquare || null
        this.flatTotal = payload?.flatTotal || null
        this.aboveGroundFloorsCount = payload?.aboveGroundFloorsCount || null
        this.undergroundFloorsCount = payload?.undergroundFloorsCount || null
        this.flat = payload?.flat || null
        this.apartmentNumber = payload?.apartmentNumber || ""
        this.roomTotal = payload?.roomTotal || null
        this.areaUnits = Number.isInteger(payload?.areaUnits) ? payload?.areaUnits : null
        this.status = payload?.status || null
        this.subdivision = payload?.subdivision || ""
    }
}
