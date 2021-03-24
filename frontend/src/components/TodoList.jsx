import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { TODO_STORE, APP_STORE } from '../store'
import TodoFilter from '../store/filters/todos'
import AddTodo from './AddTodo'
import TodoDragDrop from './TodoDragDrop'

import styles from '../styles/style.module.scss'

@observer
class TodoList extends Component {
  render() {
    const { todos } = this.props
    return (
      <div className={styles.list_container}>
        <TodoDragDrop todos={todos} />
        <AddTodo />
      </div>
    )
  }
}

const TodoListContainer = inject((stores) => {
  const filter = new TodoFilter(stores, TODO_STORE)
  const { currentListId, selectedTags } = stores[APP_STORE]
  let todos = filter.getItemsByList(currentListId)

  if (selectedTags.length) {
    const checkSubArray = (arr, sub) => sub.every((v) => arr.includes(v))
    todos = todos.filter((todo) => checkSubArray(todo.tags, selectedTags))
  }
  return { todos }
})(TodoList)

export default TodoListContainer
