import React, { Component } from 'react'
import styles from '../styles/AddTodo.module.scss'
import Button from './Button'
import SelectDate from './SelectDate'
import SelectList from './SelectList'
import SelectTag from './SelectTag'

export default class TodoEditForm extends Component {
  state = { listId: null, task: '', date: null, tags: [] }

  componentDidMount() {
    if (this.props.initialData) {
      const { listId, task, date, tags } = this.props.initialData
      this.setState({ listId, task, date, tags })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // console.log('Todo Form Submit', this.state)
    this.props.onSubmit(this.state)
  }

  handleInputChange = (e) => {
    this.setState((state) => ({ ...state, task: e.target.value }))
  }
  handleListChange = (option) => {
    if (option) {
      const listId = option.value
      this.setState((state) => ({ ...state, listId }))
    } else {
      this.setState((state) => ({ ...state, listId: null }))
    }
  }
  handleTagChange = (tags) => {
    this.setState((state) => ({ ...state, tags }))
  }
  handleDateChange = (date) => {
    this.setState((state) => ({
      ...state,
      date: date.toLocaleDateString('en-CA')
    }))
  }
  render() {
    return (
      <form className={styles.task_editor} onSubmit={this.handleSubmit}>
        <div className={styles.content}>
          <div className={styles.textarea}>
            <input
              className={styles.input}
              type='text'
              placeholder='new task'
              value={this.state.task}
              onChange={this.handleInputChange}
            />
          </div>
          <div className={styles.extras}>
            <SelectDate
              default={this.state.date}
              onChange={this.handleDateChange}
            />
            <SelectList
              defaultList={this.state.listId}
              onChange={this.handleListChange}
            />
            <SelectTag
              defaultTags={this.state.tags}
              onChange={this.handleTagChange}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button buttonType={'add'} text={'save'} />
          <Button
            buttonType={'cancel'}
            text={'cancel'}
            onClick={this.props.toggleEdit}
          />
        </div>
      </form>
    )
  }
}
