import { IAutocompleteOptions } from '~/infrastructure/interfaces/components-properties/Autocomplete/IAutocompleteOptions';

const defaultOptions = {
    valueExpr: "name",
    showClearButton: false,
    showDropDownButton: false,
    openOnFieldClick: false,
    disabled: false,
    readOnly: false,
    wrapItemText: true,
}

export class AutocompleteProperties {
    valueExpr: string
    dataSource: any
    openOnFieldClick: boolean
    showClearButton: boolean
    showDropDownButton: boolean
    readOnly: boolean
    disabled: boolean
    wrapItemText: boolean
    onItemClick?: (event: any) => void
    onValueChanged?: (event: any) => void
    constructor(options: IAutocompleteOptions) {
        options = Object.assign({}, defaultOptions, options)        
        this.valueExpr = options?.valueExpr
        this.showClearButton = options?.showClearButton
        this.showDropDownButton = options?.showDropDownButton
        this.openOnFieldClick = options?.openOnFieldClick
        this.disabled = options?.disabled
        this.readOnly = options?.readOnly
        this.wrapItemText = options?.wrapItemText
        this.onItemClick = options?.onItemClick
        this.onValueChanged = options?.onValueChanged
    }
}