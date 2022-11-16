export interface ITerritorialUnit {
    name: string
    fullAddress: string
    typeName: string
    regionId: number
    districtId: number
    parentId: number | null
    status: number
}
