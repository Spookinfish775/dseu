export interface IRealEstate {
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
}
