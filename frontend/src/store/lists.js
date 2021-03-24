import { action, observable, computed, makeObservable, autorun } from 'mobx'
import db from '../utils/index'

class List {
  @observable id
  @observable name
  constructor(name) {
    makeObservable(this)
    this.id = `list_${Date.now()}`
    this.name = name
    this.created = new Date().toLocaleDateString('en-CA')
  }
}
export class ListStore {
  @observable ids = []
  @observable items = {}

  constructor() {
    makeObservable(this)
    this.ids = db.get('lists')?.ids || []
    this.items = db.get('lists')?.items || {}
    autorun(() => db.set('lists', { ids: this.ids, items: this.items }))
  }

  @computed get lists() {
    return Object.values(this.items)
  }

  @action.bound fetchLists = () => {
    const lists = db.get('lists') || {}
    this.ids = lists.ids || []
    this.items = lists.items || {}
  }

  @action.bound addList = (name) => {
    const newList = new List(name)
    this.ids.push(newList.id)
    this.items[newList.id] = newList
  }

  @action.bound updateList = (id, listData) => {
    this.items[id] = { ...this.items[id], ...listData }
  }

  @action.bound deleteList = (id) => {
    this.ids = this.ids.filter((listId) => listId !== id)
    delete this.items[id]
  }
}

export const LIST_STORE = 'listStore'
