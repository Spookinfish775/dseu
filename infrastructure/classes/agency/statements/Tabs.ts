import { ITabs } from '~/infrastructure/interfaces/agency/statements/ITabs';
import { ITab } from '~/infrastructure/interfaces/agency/statements/ITab';

export class Tabs implements ITabs {
  tabs: ITab[]
  constructor() {
    this.tabs = []
  }

  addTab(payload: ITab) {
    this.tabs.push(payload)
  }
}

export class Tab implements ITab {
  text: string
  path: string
  constructor(payload: ITab) {
    this.text = payload.text
    this.path = payload.path
  }
}