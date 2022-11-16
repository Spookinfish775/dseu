
export type DataSourceItem = {
  id: string | number,
  name: string,
  icon?: any,
  value: string,
  disabled?:boolean
}
export abstract class BaseDataSource {
  public entityName: string
  protected _items: { [key: string]: DataSourceItem } | [] = []
  constructor(ctx: Vue, data, entityName, imgs?,) {
    this.entityName = entityName;
    this._configure(ctx, data, imgs)
  }
  private _configure(ctx: Vue, data, imgs?,) {
    for (const item in data) {
      this._items[data[item]] = { name: ctx.$t(`${this.entityName}.${item}`).toString(), id: +data[item], value: item, icon: imgs ? imgs[item] : undefined }
    }
  }
  public getAll() {
    return Object.values(this._items)
  }
  public filterById(filter: Array<string | number>): DataSourceItem[] {
    const result: DataSourceItem[] = []
    for (const el in this._items) {
      if (filter.some(element => element === el))
        result.push(this._items[el])
    }
    return result
  }
  public filterByValues(values: string[]): DataSourceItem[] {
    const result: DataSourceItem[] = []
    for (const el in this._items) {
      if (values.some(element => element === this._items[el].value))
        result.push(this._items[el])
    }
    return result
  }
  public getByid(id: string | number): DataSourceItem {
    if (this._items.hasOwnProperty(id))
      return this._items[id]
    else
      throw "can not find that id"
  }

}