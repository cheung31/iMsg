
import React, { Component } from 'react'
import style from './style.css'

class ConversationListItem extends Component {
  render() {
    const { conversation } = this.props
    return (
      <div className={style.listItem}>
        <h3>{conversation.title}</h3>
        <span>{conversation.body || ''}</span>
      </div>
    )
  }
}

export default ConversationListItem
