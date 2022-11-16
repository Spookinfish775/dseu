import { IAutocompleteOptions } from '~/infrastructure/interfaces/components-properties/Autocomplete/IAutocompleteOptions';

export interface IAutocompletePropertiesWithDataSource extends IAutocompleteOptions {
    loadUrl: string,
    key?: string
}