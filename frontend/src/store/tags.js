import {
  action,
  observable,
  computed,
  makeObservable,
  runInAction,
  autorun
} from 'mobx'

class Tag {
  @observable name
  constructor(name) {
    makeObservable(this)
    this.id = `tag_${Date.now()}`
    this.name = name
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
export class TagStore {
  @observable tags = []

  constructor() {
    makeObservable(this)
  }

  @computed get tagCount() {
    return this.tags.length
  }

  @action.bound async fetchTags() {
    const response = await fetch(`http://localhost:8080/api/tags`)
    const data = await response.json()
    runInAction(() => {
      this.tags = data
    })
  }

  @action.bound getTag(id) {
    const tag = this.tags.filter((tag) => tag.id === id)
    return tag || {}
  }

  @action.bound async addTag(name) {
    const newTag = new Tag(name)
    const response = await fetch(`http://localhost:8080/api/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_tag: newTag.toJSON() })
    })
    const data = await response.json()

    runInAction(() => {
      this.fetchTags()
      console.log('add tag data', data)
    })
  }

  @action.bound async updateTag(id, tagData) {
    const response = await fetch(`http://localhost:8080/api/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag_data: tagData })
    })
    const data = await response.json()

    runInAction(() => {
      this.fetchTags()
      console.log('update tag data', data)
    })
  }

  @action.bound async deleteTag(id) {
    const response = await fetch(`http://localhost:8080/api/tags/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()

    runInAction(() => {
      this.fetchTags()
      console.log('delete tag data', data)
    })
  }
}

export const TAG_STORE = 'tagStore'
