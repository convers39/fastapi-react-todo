import React, { Component } from 'react'
import styles from '../styles/SideBar.module.scss'

import CreateList from './CreateList'
import TagFilter from './TagFilter'
import ListFilter from './ListFilter'

export default class SideBar extends Component {
  render() {
    return (
      <div className={styles.container}>
        <ListFilter />
        <CreateList />
        <TagFilter />
      </div>
    )
  }
}
