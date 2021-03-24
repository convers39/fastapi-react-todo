import { action, observable, makeObservable, runInAction } from 'mobx'

class List {
  @observable name
  constructor(name) {
    makeObservable(this)
    this.id = `list_${Date.now()}`
    this.name = name
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
export class ListStore {
  @observable lists = []
  constructor() {
    makeObservable(this)
  }

  @action.bound async fetchLists() {
    const response = await fetch(`http://localhost:8080/api/lists`)
    const data = await response.json()
    runInAction(() => {
      this.lists = data
    })
  }

  @action.bound async addList(name) {
    const newList = new List(name)
    const response = await fetch(`http://localhost:8080/api/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_list: newList.toJSON() })
    })
    const data = await response.json()

    runInAction(() => {
      this.fetchLists()
      console.log('add list data', data)
    })
  }

  @action.bound async updateList(id, listData) {
    const response = await fetch(`http://localhost:8080/api/lists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list_data: listData })
    })
    const data = await response.json()

    runInAction(() => {
      this.fetchLists()
      console.log('update list data', data)
    })
  }

  @action.bound async deleteList(id) {
    const response = await fetch(`http://localhost:8080/api/lists/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()

    runInAction(() => {
      this.fetchLists()
      console.log('delete list data', data)
    })
  }
}

export const LIST_STORE = 'listStore'
