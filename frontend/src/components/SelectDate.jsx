import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import enCA from 'date-fns/locale/en-CA'

import styles from '../styles/AddTodo.module.scss'

import 'react-datepicker/dist/react-datepicker.css'
registerLocale('en-ca', enCA)

export default class SelectDate extends Component {
  state = { date: new Date() }

  handleChange = (newDate) => {
    this.setState({ date: newDate })
    this.props.onChange(newDate)
  }

  render() {
    const timestamp = Date.parse(this.props.default)
    const parsedDate = new Date(timestamp)

    return (
      <DatePicker
        locale='en-ca'
        className={styles.date_picker}
        selected={this.props.default ? parsedDate : this.state.date}
        onChange={this.handleChange}
      />
    )
  }
}
