import { action, observable, computed, makeObservable, autorun } from 'mobx'
import db from '../utils/index'

class Tag {
  @observable id
  @observable name
  constructor(name) {
    makeObservable(this)
    this.id = `tag_${Date.now()}`
    this.name = name
    this.created = new Date().toLocaleDateString('en-CA')
  }
}
export class TagStore {
  @observable ids = []
  @observable items = {}

  constructor() {
    makeObservable(this)
    this.ids = db.get('tags')?.ids || []
    this.items = db.get('tags')?.items || {}
    autorun(() => db.set('tags', { ids: this.ids, items: this.items }))
  }

  @computed get tags() {
    return Object.values(this.items)
  }

  @action.bound fetchTags() {
    const tags = db.get('tags') || {}

    this.ids = tags.ids || []
    this.items = tags.items || {}
  }

  @action.bound getTag = (id) => {
    console.log('getTag', id, this.items, this.items[id])
    return this.items[id] || {}
  }

  @action.bound addTag(name) {
    const newTag = new Tag(name)
    this.ids.push(newTag.id)
    this.items[newTag.id] = newTag
  }

  @action.bound updateTag(id, tagData) {
    this.items[id] = { ...this.items[id], ...tagData }
  }

  @action.bound deleteTag(id) {
    this.ids = this.ids.filter((tagId) => tagId !== id)
    delete this.items[id]
  }
}

export const TAG_STORE = 'tagStore'
