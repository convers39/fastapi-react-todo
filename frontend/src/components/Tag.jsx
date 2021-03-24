import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { APP_STORE } from '../store'
import styles from '../styles/style.module.scss'

@inject(APP_STORE)
@observer
class Tag extends Component {
  render() {
    const { tagName } = this.props
    const { updateSelectedTags, selectedTags } = this.props[APP_STORE]
    return (
      <div
        className={`${
          selectedTags.includes(tagName) ? styles.tag_selected : ''
        } ${styles.tag_container}`}
        onClick={() => updateSelectedTags(tagName)}
      >
        <span>#{tagName.toUpperCase()}</span>
      </div>
    )
  }
}

export default Tag
