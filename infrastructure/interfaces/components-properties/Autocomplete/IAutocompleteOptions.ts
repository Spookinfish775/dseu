export interface IAutocompleteOptions {
    loadUrl?: string
    dataSource?: any[]
    valueExpr?: string
    showClearButton?: boolean
    showDropDownButton?: boolean
    openOnFieldClick?: boolean
    readOnly?: boolean
    disabled?: boolean
    wrapItemText?: boolean
    filter?: any[]
    onItemClick?: (event: any) => void
    onValueChanged?: (event: any) => void
}