import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { TAG_STORE, TODO_STORE } from '../store'
import Tag from './Tag'
import FilterWrapper from './FilterWrapper'
import Button from './Button'
import styles from '../styles/SideBar.module.scss'

@inject(TAG_STORE, TODO_STORE)
@observer
class TagFilter extends Component {
  componentDidMount() {
    this.props[TAG_STORE].fetchTags()
  }
  handleDeleteTag = (tagId) => {
    const tag = this.props.tagStore.getTag(tagId)
    this.props.tagStore.deleteTag(tagId)
    this.props.todoStore.deleteTodoTags(tag.name)
  }

  render() {
    const { tags } = this.props[TAG_STORE]

    return (
      <FilterWrapper id='tag-filter' filterName='Tags'>
        <div className='tag-filter-container'>
          <ul className='tag-filter'>
            {tags.map((tag) => (
              <li key={tag.id} className={styles.tag_filter_item}>
                <Tag tagName={tag.name} />
                <Button
                  buttonType={'delete'}
                  icon={'delete'}
                  onClick={() => this.handleDeleteTag(tag.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </FilterWrapper>
    )
  }
}

export default TagFilter
