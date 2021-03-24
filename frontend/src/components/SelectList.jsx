import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { LIST_STORE } from '../store'
import Select from 'react-select'
import styles from '../styles/AddTodo.module.scss'
@inject(LIST_STORE)
@observer
class SelectList extends Component {
  render() {
    const { lists } = this.props[LIST_STORE]
    let { defaultList } = this.props

    const options = lists.map((list) => ({
      value: list.id,
      label: list.name
    }))
    // in edit mode retrieve default list
    const defaultIndex =
      defaultList && lists.findIndex((list) => list.id === defaultList)

    return (
      <Select
        className={styles.list_selector}
        classNamePrefix='select'
        placeholder='List'
        value={options[defaultIndex] || ''}
        isClearable={true}
        isSearchable={true}
        onChange={this.props.onChange}
        name='list-selector'
        options={options}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: 'lightblue',
            primary: 'darkgray'
          }
        })}
      />
    )
  }
}

export default SelectList
