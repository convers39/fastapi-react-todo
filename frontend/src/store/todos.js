import {
  action,
  observable,
  computed,
  makeObservable,
  autorun,
  runInAction
} from 'mobx'

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
  }
  toJSON() {
    return {
      id: this.id,
      listId: this.listId,
      task: this.task,
      tags: this.tags,
      date: this.date,
      finished: this.finished,
      deleted: this.deleted
    }
  }
}
export class TodoStore {
  @observable ids = []
  // ["todo_1614592246644", "todo_1614614664916", "todo_1614614664906", "todo_1614592246648", "todo_1614591103488", "todo_1614592246649", "todo_1614591103468", "todo_1614591103478", "todo_1614614665906", "todo_1616559532794", "todo_1616586593307"]
  @observable todos = []

  constructor() {
    makeObservable(this)
    this.lastIdx = null
    autorun(() => {
      if (this.ids.length) this.updateIds(this.ids)
    })
  }

  @computed get finishedCount() {
    return this.todos.filter((todo) => todo.finished).length
  }

  @computed get totalCount() {
    return this.todos.length
  }

  async updateIds(ids) {
    console.log('updateIds', ids)
    const response = await fetch(`http://localhost:8080/api/todos/ids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
    const data = await response.json()
    runInAction(() => {
      console.log('update ids', data)
    })
  }

  @action.bound async fetchIds() {
    const response = await fetch(`http://localhost:8080/api/todos/ids`)
    const data = await response.json()
    runInAction(() => {
      this.ids = data
      console.log('fetch todo ids', data)
    })
  }

  @action.bound async fetchTodos() {
    const response = await fetch(`http://localhost:8080/api/todos`)
    const data = await response.json()
    // console.log('fetchTodos', data, response)
    runInAction(() => {
      this.todos = data
      // this.lastIdx = this.todos[this.todos.length - 1].index
    })
  }

  @action.bound async addTodo(todoData) {
    const { listId, task, date, tags } = todoData
    const newTodo = new Todo(listId, task, date, tags)

    const response = await fetch(`http://localhost:8080/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_todo: newTodo.toJSON() })
    })
    const data = await response.json()

    runInAction(() => {
      this.ids.push(newTodo.id)
      this.fetchTodos()
      console.log('add todo data', data)
    })
  }

  @action.bound async updateTodo(id, todoData) {
    // console.log('todo data', id, todoData)
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
    const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()

    runInAction(() => {
      this.ids = this.ids.filter((todoId) => todoId !== id)
      this.todos = this.todos.filter((todo) => todo.id !== id)
      console.log('delete todo data', data)
    })
  }

  @action.bound async toggleFinished(id) {
    const response = await fetch(
      `http://localhost:8080/api/todos/${id}/toggle`,
      { method: 'POST' }
    )
    const data = await response.json()
    runInAction(() => {
      const todo = this.todos.find((t) => t.id === id)
      todo.finished = !todo.finished
      console.log('toggle todo data', data)
    })
  }

  @action.bound async updateTodoOrder(sourceId, destinationId) {
    const sourceIndex = this.ids.indexOf(sourceId)
    const destinationIndex = this.ids.indexOf(destinationId)

    let temp = this.ids[sourceIndex]
    this.ids[sourceIndex] = this.ids[destinationIndex]
    this.ids[destinationIndex] = temp
    runInAction(() => {
      // this.fetchTodos()
      console.log('update todo order', this.ids)
    })
  }
}

export const TODO_STORE = 'todoStore'
