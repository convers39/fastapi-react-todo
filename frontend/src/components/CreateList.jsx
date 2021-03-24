import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { LIST_STORE } from '../store'
import styles from '../styles/SideBar.module.scss'

import Button from './Button'
import FilterWrapper from './FilterWrapper'

@inject(LIST_STORE)
@observer
class CreateList extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    const { listName } = e.target.elements
    this.props[LIST_STORE].addList(listName.value)
    listName.value = ''
  }
  render() {
    return (
      <FilterWrapper id='new-list' filterName='Create List'>
        <form className={styles.new_list_form} onSubmit={this.handleSubmit}>
          <input
            className={styles.text_input}
            type='text'
            name='listName'
            placeholder='List name'
          />
          <Button buttonType={'create'} text='Create' />
        </form>
      </FilterWrapper>
    )
  }
}

export default CreateList
