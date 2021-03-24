import React, { Component } from 'react'
import styles from '../styles/Button.module.scss'
import Icon from './Icon'

export default class Button extends Component {
  handleClick = (e) => {
    e.preventDefault()
    this.props.onClick()
  }
  render() {
    let { buttonType, icon, text } = this.props
    let className = ''
    switch (buttonType) {
      case 'delete':
        className = styles.delete
        break
      case 'edit':
        className = styles.edit
        break
      case 'sort':
        className = styles.sort
        break
      case 'add':
        className = styles.add
        break
      case 'expand':
        className = styles.expand
        break
      case 'create':
        className = styles.create
        break
      case 'cancel':
        className = styles.cancel
        break
      case 'all':
        className = styles.all_todo
        break
      default:
        break
    }
    return (
      <button
        className={`${styles.btn} ${className}`}
        onClick={this.props.onClick && this.handleClick}
      >
        <Icon icon={icon} />
        {text || ''}
      </button>
    )
  }
}
