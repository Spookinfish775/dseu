export interface IClaim {
    type: number
    value: number
}

export interface IRole {
    name: string
    claims: IClaim[]
}
