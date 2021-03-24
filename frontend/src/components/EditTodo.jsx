import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { TODO_STORE, APP_STORE } from '../store'
import TodoEditForm from './TodoEditForm'

@inject(APP_STORE, TODO_STORE)
@observer
class EditTodo extends Component {
  handleSubmit = (todoData) => {
    const todoId = this.props.todoId
    this.props[TODO_STORE].updateTodo(todoId, todoData)
    this.props[APP_STORE].updateEditingTodo(null)
  }

  render() {
    return (
      <TodoEditForm
        initialData={this.props.initialData}
        onSubmit={this.handleSubmit}
        toggleEdit={() => this.props[APP_STORE].updateEditingTodo(null)}
      />
    )
  }
}

export default EditTodo
