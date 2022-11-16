export interface ITextAreaOptions {
    readOnly?: boolean
    disabled?: boolean
    showClearButton?: boolean
    height?:number
    valueChangeEvent?: string
    onValueChanged?: (event: any) => void
}