export interface ITextBoxOptions {
    readOnly?: boolean
    disabled?: boolean
    showClearButton?: boolean
    valueChangeEvent?: string
    onValueChanged?: (event: any) => void
}