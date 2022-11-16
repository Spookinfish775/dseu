import { AutocompleteProperties } from "~/infrastructure/components-properties/Autocomplete/AutocompleteProperties"
import { IAutocompletePropertiesWithLocalData } from '~/infrastructure/interfaces/components-properties/Autocomplete/IAutocompletePropertiesWithLocalData';


export class AutocompletePropertiesWithLocalData extends AutocompleteProperties {
    dataSource: any
    constructor(options: IAutocompletePropertiesWithLocalData) {
        super(options)
        this.dataSource = options.dataSource
    }
}