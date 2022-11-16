import { IAutocompleteOptions } from '~/infrastructure/interfaces/components-properties/Autocomplete/IAutocompleteOptions';

export interface IAutocompletePropertiesWithLocalData extends IAutocompleteOptions {
    dataSource: any[]
}
