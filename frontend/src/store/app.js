import { action, observable, makeObservable } from 'mobx'

export class AppStore {
  @observable currentListId = null
  @observable editingTodoId = null
  @observable selectedTags = []

  constructor() {
    makeObservable(this)
  }

  @action.bound selectList = (id) => {
    this.currentListId = id
  }

  @action.bound updateEditingTodo = (id) => {
    this.editingTodoId = id
  }

  @action.bound updateSelectedTags = (tag) => {
    let currentTags = [...this.selectedTags]
    if (currentTags.includes(tag)) {
      currentTags = currentTags.filter((t) => t !== tag)
    } else {
      currentTags.push(tag)
    }
    this.selectedTags = currentTags
  }

  @action.bound clearListFilter = () => {
    this.currentListId = null
  }

  @action.bound clearTagsFilter = () => {
    this.selectedTags = []
  }
}

export const APP_STORE = 'appStore'
