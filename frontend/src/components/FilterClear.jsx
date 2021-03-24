import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { APP_STORE } from '../store'
import Button from './Button'
import styles from '../styles/style.module.scss'

@inject(APP_STORE)
@observer
class FilterClear extends Component {
  render() {
    const { clearType } = this.props
    const { clearListFilter, clearTagsFilter } = this.props[APP_STORE]

    let handleClick, className
    switch (clearType) {
      case 'lists':
        handleClick = clearListFilter
        className = styles.filter_clear_container
        break
      case 'tags':
        handleClick = clearTagsFilter
        break
      default:
        handleClick = () => {}
    }

    return (
      <div className={className}>
        <Button buttonType={'all'} text={'ALL TODO'} onClick={handleClick} />
      </div>
    )
  }
}

export default FilterClear
