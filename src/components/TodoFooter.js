import React, { Component } from 'react'

export default class Footer extends Component {
  // static propTypes = {
  //   completedCount: PropTypes.number.isRequired,
  //   activeCount: PropTypes.number.isRequired,
  //   filter: PropTypes.string.isRequired,
  //   onClearCompleted: PropTypes.func.isRequired,
  //   onShow: PropTypes.func.isRequired
  // }

  renderTodoCount() {
    const {activeCount} = this.props

    const itemWord = activeCount === 1 ? 'task' : 'tasks'

    return (
      <div className="todo-count">
        <strong>{activeCount || 'No'}</strong> <span>{itemWord} left</span>
      </div>
    )
  }

  renderClearButton() {
    const {completedCount, onClearCompleted} = this.props
    if (completedCount > 0) {
      return (
        <button className="clear-completed" onClick={onClearCompleted} >
          Clear completed
        </button>
      )
    }
  }

  render() {
    return (
      <footer className="footer">
        <div className="footer-info">
          {this.renderTodoCount()}
          {this.renderClearButton()}
        </div>
      </footer>
    )
  }
}
