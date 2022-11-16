export interface INumberBoxOptions {
    value?: any
    readOnly?: boolean
    disabled?: boolean
    showClearButton?: boolean
    valueChangeEvent?: string
    onValueChanged?: (event: any) => void
}