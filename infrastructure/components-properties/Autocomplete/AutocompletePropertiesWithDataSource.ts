import DataSource from "devextreme/data/data_source";
import Vue from 'vue'

import { AutocompleteProperties } from "~/infrastructure/components-properties/Autocomplete/AutocompleteProperties"
import { IAutocompletePropertiesWithDataSource } from '~/infrastructure/interfaces/components-properties/Autocomplete/IAutocompletePropertiesWithDataSource';


export class AutocompletePropertiesWithDataSource extends AutocompleteProperties {
    dataSource: DataSource
    constructor(context: Vue, options: IAutocompletePropertiesWithDataSource) {
        super(options)
        this.dataSource = new DataSource({
            store: context.$dxStore({
                key: options?.key || "name",
                loadUrl: options.loadUrl,
            }),
            filter: options?.filter || null
        })
    }
}