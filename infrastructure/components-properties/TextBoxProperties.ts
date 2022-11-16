import { ITextBoxOptions } from '~/infrastructure/interfaces/components-properties/ITextBoxOptions';

const defaultOptions = {
    readOnly: false,
    disabled: false,
    showClearButton: true,
    valueChangeEvent: "change",
}

export class TextBoxProperties {
    readOnly?: boolean
    disabled?: boolean
    showClearButton?: boolean
    valueChangeEvent?: string
    onValueChanged?: (event: any) => void
    constructor(options?: ITextBoxOptions) {
        options = Object.assign({}, defaultOptions, options)
        this.readOnly = options?.readOnly
        this.disabled = options?.disabled
        this.showClearButton = options?.showClearButton
        this.valueChangeEvent = options?.valueChangeEvent
        this.onValueChanged = options?.onValueChanged
    }
}
