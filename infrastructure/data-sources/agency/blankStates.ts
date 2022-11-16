import { BaseDataSource } from '../baseDataSource';
import { blankState as blankStateGuid } from '../../enums/agency/blankState';
export class BlankState extends BaseDataSource {
  constructor(ctx: Vue) {
    let entityName = "agency.blankStates"
    super(ctx, blankStateGuid, entityName,)
  }
  disabledAllExpext(itemsKey: Array<string | number>): this {
    for (const key in this._items) {
      if (!itemsKey.some(el => el.toString() === key)) {
        this._items[key].disabled = true
      }
    }
    return this
  }
}