import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { APP_STORE, TODO_STORE } from '../store'
import TodoEditForm from './TodoEditForm'
import Button from './Button'

import styles from '../styles/AddTodo.module.scss'

@inject(APP_STORE, TODO_STORE)
@observer
class AddTodo extends Component {
  handleSubmit = (todoData) => {
    this.props[TODO_STORE].addTodo(todoData)
    this.props[APP_STORE].updateEditingTodo(null)
  }

  render() {
    return (
      <>
        {this.props[APP_STORE].editingTodoId === 'newTodo' ? (
          <div className={styles.add_todo_container}>
            <TodoEditForm
              onSubmit={this.handleSubmit}
              toggleEdit={() => this.props[APP_STORE].updateEditingTodo(null)}
            />
          </div>
        ) : (
          <Button
            buttonType={'expand'}
            text={'New Todo'}
            onClick={() => this.props[APP_STORE].updateEditingTodo('newTodo')}
          >
            Add Todo
          </Button>
        )}
      </>
    )
  }
}

export default AddTodo
