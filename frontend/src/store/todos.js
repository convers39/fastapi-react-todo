import { action, observable, computed, makeObservable, autorun } from 'mobx'
import db from '../utils/index'

class Todo {
  @observable id
  @observable listId
  @observable task
  @observable tags
  @observable finished
  @observable deleted

  constructor(listId, task, date, tags) {
    makeObservable(this)
    this.id = `todo_${Date.now()}`
    this.task = task
    this.listId = listId
    this.tags = tags
    this.date = date || new Date().toLocaleDateString('en-CA')
    this.finished = false
    this.deleted = false
    this.created = new Date().toLocaleDateString('en-CA')
  }
}
export class TodoStore {
  @observable ids = []
  @observable items = {}

  constructor() {
    makeObservable(this)
    this.ids = db.get('todos')?.ids || []
    this.items = db.get('todos')?.items || {}
    autorun(() => db.set('todos', { ids: this.ids, items: this.items }))
  }

  @computed get todos() {
    return Object.values(this.items)
  }

  @computed get finishedCount() {
    return this.todos.filter((todo) => todo.finished).length
  }

  @action.bound fetchTodos() {
    const todos = db.get('todos') || {}

    this.ids = todos.ids || []
    this.items = todos.items || {}
  }

  @action.bound addTodo = (todoData) => {
    const { listId, task, date, tags } = todoData
    const newTodo = new Todo(listId, task, date, tags)

    this.ids.push(newTodo.id)
    this.items[newTodo.id] = newTodo
  }

  @action.bound updateTodo = (id, todoData) => {
    this.items[id] = { ...this.items[id], ...todoData }
  }

  @action.bound deleteTodoTags = (tag) => {
    this.todos.forEach((todo) => {
      if (todo.tags.includes(tag)) {
        todo.tags = todo.tags.filter((name) => name !== tag)
      }
    })
  }

  @action.bound deleteTodo = (id) => {
    this.ids = this.ids.filter((todoId) => todoId !== id)
    delete this.items[id]
  }

  @action.bound toggleFinished = (id) => {
    this.items[id].finished = !this.items[id].finished
  }

  @action.bound updateTodoOrder = (sourceId, destinationId) => {
    const sourceIndex = this.ids.indexOf(sourceId)
    const destinationIndex = this.ids.indexOf(destinationId)

    let temp = this.ids[sourceIndex]
    this.ids[sourceIndex] = this.ids[destinationIndex]
    this.ids[destinationIndex] = temp
    // [ids[sourceIndex],ids[destinationIndex]] = [ids[destinationIndex],ids[sourceIndex]]
  }
}

export const TODO_STORE = 'todoStore'
