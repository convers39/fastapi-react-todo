import React, { Component } from 'react'
import styles from '../styles/TodoItem.module.scss'
import { inject, observer } from 'mobx-react'
import { APP_STORE } from '../store'

import EditTodo from './EditTodo'
import DisplayTodo from './DisplayTodo'
@inject(APP_STORE)
@observer
class TodoItem extends Component {
  render() {
    const { todo } = this.props

    return (
      <div className={styles.task_item}>
        {this.props[APP_STORE].editingTodoId === todo.id ? (
          <EditTodo todoId={todo.id} initialData={todo} />
        ) : (
          <DisplayTodo todo={todo} />
        )}
      </div>
    )
  }
}

export default TodoItem
