import { INumberBoxOptions } from '~/infrastructure/interfaces/components-properties/INumberBoxOptions';

const defaultOptions = {
    readOnly: false,
    disabled: false,
    showClearButton: true,
    valueChangeEvent: "change"
}

export class NumberBoxProperties {
    value?: any
    readOnly?: boolean
    disabled?: boolean
    showClearButton?: boolean
    valueChangeEvent?: string
    onValueChanged?: (event: any) => void
    constructor(options?: INumberBoxOptions) {
        options = Object.assign({}, defaultOptions, options)
        this.value = options?.value
        this.readOnly = options?.readOnly 
        this.disabled = options?.disabled 
        this.showClearButton = options?.showClearButton
        this.valueChangeEvent = options?.valueChangeEvent
        this.onValueChanged = options?.onValueChanged
    }
}
