import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { TODO_STORE, APP_STORE } from '../store'
import AddTodo from './AddTodo'
import TodoDragDrop from './TodoDragDrop'

import styles from '../styles/style.module.scss'

@observer
class TodoList extends Component {
  componentDidMount() {
    this.props.fetchTodos()
  }
  render() {
    const { todos } = this.props
    console.log('todos', todos)
    return (
      <div className={styles.list_container}>
        {todos?.length ? (
          <TodoDragDrop todos={todos} />
        ) : (
          <h1>Loading Todo...</h1>
        )}
        <AddTodo />
      </div>
    )
  }
}

const TodoListContainer = inject((stores) => {
  const { currentListId, selectedTags } = stores[APP_STORE]
  let { fetchTodos, todos } = stores[TODO_STORE]
  // filter by list id
  if (currentListId) {
    todos = todos.filter((todo) => todo.listId === currentListId)
  }
  // filter by tags
  if (selectedTags.length) {
    const checkSubArray = (arr, sub) => sub.every((v) => arr.includes(v))
    todos = todos.filter((todo) => checkSubArray(todo.tags, selectedTags))
  }
  return { todos, fetchTodos }
})(TodoList)

export default TodoListContainer
