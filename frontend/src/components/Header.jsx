import React, { Component } from 'react'
import styles from '../styles/style.module.scss'
import Button from './Button'

export default class Header extends Component {
  render() {
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          <h2>
            <span>Welcome</span>
            <small>{new Date().toDateString()}</small>
          </h2>
          <div>
            <Button buttonType={'sort'} icon={'sort'} />
          </div>
        </div>
      </header>
    )
  }
}
