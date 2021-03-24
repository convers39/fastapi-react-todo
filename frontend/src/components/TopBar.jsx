import React, { Component } from 'react'
import styles from '../styles/TopBar.module.scss'
import Icon from './Icon'

export default class TopBar extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.inner_left}>
            <Icon icon={'menu'} />
          </div>
          <div className={styles.inner_right}>
            <Icon icon={'home'} />
          </div>
        </div>
      </div>
    )
  }
}
