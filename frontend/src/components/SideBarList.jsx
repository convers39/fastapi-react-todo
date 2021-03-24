import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { LIST_STORE, APP_STORE } from '../store'
import styles from '../styles/SideBar.module.scss'

@inject(LIST_STORE, APP_STORE)
@observer
class SideBarList extends Component {
  render() {
    const { list } = this.props
    const { deleteList } = this.props[LIST_STORE]
    const { currentListId, selectList } = this.props[APP_STORE]

    return (
      <li
        className={`${currentListId === list.id ? styles.active : ''} ${
          styles.list_wrapper
        }`}
      >
        <div
          id={list.id}
          className={`${styles.list_item}`}
          onClick={() => selectList(list.id)}
        >
          {list.name}
        </div>
        <button
          className={styles.list_remove_btn}
          onClick={() => deleteList(list.id)}
        >
          &times;
        </button>
      </li>
    )
  }
}

export default SideBarList
