import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { LIST_STORE } from '../store'
import styles from '../styles/SideBar.module.scss'
import SideBarList from './SideBarList'
import FilterClear from './FilterClear'

@inject(LIST_STORE)
@observer
class ListFilter extends Component {
  render() {
    const { lists } = this.props[LIST_STORE]

    return (
      <div className={styles.list_container}>
        <FilterClear clearType={'lists'} />
        {lists ? (
          <ul className={styles.list_filter}>
            {lists.map((list) => (
              <SideBarList key={list.id} list={list} />
            ))}
          </ul>
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    )
  }
}

export default ListFilter
