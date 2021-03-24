import {
  action,
  observable,
  computed,
  makeObservable,
  autorun,
  runInAction
} from 'mobx'
import db from '../utils/index'

class Todo {
  @observable listId
  @observable task
  @observable tags
  @observable finished
  @observable deleted

  constructor(listId, task, date, tags) {
    makeObservable(this)
    this.id = `todo_${Date.now()}`
    this.listId = listId
    this.task = task
    this.tags = tags
    this.date = date || new Date().toLocaleDateString('en-CA')
    this.finished = false
    this.deleted = false
    this.index = 0
  }
  toJSON() {
    return {
      id: this.id,
      listId: this.listId,
      task: this.task,
      tags: this.tags,
      date: this.date,
      finished: this.finished,
      deleted: this.deleted,
      index: this.index
    }
  }
}
export class TodoStore {
  @observable ids = []
  @observable items = {}
  @observable todos = []

  constructor() {
    makeObservable(this)
    this.ids = db.get('ids') || []
    // this.lastIdx = null
    autorun(() => db.set('ids', this.ids))
  }

  // @computed get todos() {
  //   return Object.values(this.items)
  // }

  @computed get finishedCount() {
    return this.todos.filter((todo) => todo.finished).length
  }

  @action.bound async fetchTodos() {
    const response = await fetch(`http://localhost:8080/api/todos`)
    const data = await response.json()
    // console.log('fetchTodos', data, response)
    runInAction(() => {
      this.todos = data
    })
  }

  @action.bound async addTodo(todoData) {
    const { listId, task, date, tags } = todoData
    const newTodo = new Todo(listId, task, date, tags)
    console.log('new todo', JSON.stringify(newTodo.toJSON()))
    const response = await fetch(`http://localhost:8080/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_todo: newTodo.toJSON() })
    })
    const data = await response.json()

    this.ids.push(newTodo.id)
    runInAction(() => {
      this.fetchTodos()
      console.log('add todo data', data)
    })
  }

  @action.bound async updateTodo(id, todoData) {
    console.log('todo data', id, todoData)
    const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo_data: todoData })
    })
    const data = await response.json()

    runInAction(() => {
      this.fetchTodos()
      console.log('update todo data', data)
    })
  }

  @action.bound deleteTodoTags(tag) {
    this.todos.forEach((todo) => {
      if (todo.tags.includes(tag)) {
        todo.tags = todo.tags.filter((name) => name !== tag)
      }
    })
  }

  @action.bound async deleteTodo(id) {
    this.ids = this.ids.filter((todoId) => todoId !== id)
    this.todos = this.todos.filter((todo) => todo.id !== id)

    const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()

    runInAction(() => {
      // this.fetchTodos()
      console.log('delete todo data', data)
    })
  }

  @action.bound async toggleFinished(id) {
    const response = await fetch(
      `http://localhost:8080/api/todos/toggle/${id}`,
      { method: 'PUT' }
    )
    const data = await response.json()
    runInAction(() => {
      console.log('toggle todo data', data)
    })
    const todo = this.todos.find((t) => t.id === id)
    todo.finished = !todo.finished
  }

  @action.bound async updateTodoOrder(sourceId, destinationId) {
    const source = this.todos.find((todo) => todo.id === sourceId)
    const destination = this.todos.find((todo) => todo.id === destinationId)
    let temp = source.index
    source.index = destination.index
    destination.index = temp

    const response = await fetch(`http://localhost:8080/api/todos/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: source.index,
        destination: destination.index
      })
    })
    const data = await response.json()

    runInAction(() => {
      // this.fetchTodos()
      console.log('update todo order', data)
    })

    // [ids[sourceIndex],ids[destinationIndex]] = [ids[destinationIndex],ids[sourceIndex]]
  }
}

export const TODO_STORE = 'todoStore'
