import React, {Component, PropTypes} from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import TodoItem from './TodoItem'
import Footer from './TodoFooter'

 const TODO_FILTERS = {
   SHOW_ALL: () => true,
   SHOW_ACTIVE: todo => !todo.completed,
   SHOW_COMPLETED: todo => todo.completed
 }

 export default class TodoList extends Component {
//    static propTypes = {
//      todos: PropTypes.array.isRequired,
//      actions: PropTypes.object.isRequired
//    }

   state = { filter: 'SHOW_ALL', todos: [] }

   handleClearCompleted = () => {
     this.props.actions.clearCompleted()
   }

   handleShow = filter => {
     this.setState({ filter })
   }

   handleSort = ({oldIndex, newIndex}) => {
     this.props.actions.sortTodo({oldIndex, newIndex})
   }

   renderToggleAll(completedCount) {
     const { todos, actions } = this.props
     if (todos.length > 0) {
       return (<>
         <input
           className="toggle-all"
           type="checkbox"
           checked={completedCount === todos.length}
           onChange={actions.completeAll}
         />
         <label
							htmlFor="toggle-all"
						/>
       </>)
     }
   }

   renderFooter(completedCount) {
     const { todos } = this.props
     const { filter } = this.state
     const activeCount = todos.length - completedCount

     if (todos.length) {
       return (
         <Footer
           completedCount={completedCount}
           activeCount={activeCount}
           filter={filter}
           onClearCompleted={this.handleClearCompleted.bind(this)}
           onShow={this.handleShow.bind(this)} />
       )
     }
   }

   render() {
     const { todos, actions } = this.props
     const { filter } = this.state

     const filteredTodos = todos.filter(TODO_FILTERS[filter])
     const completedCount = todos.reduce((count, todo) => {
       return todo.completed ? count + 1 : count
     }, 0)

     const SortableTodoItem = SortableElement(({ value }) =>
       <TodoItem key={value.id} todo={value} {...actions} />
     );
     const SortableTodoList = SortableContainer(({ items }) => {
        return <ul className="todo-list">
          {items.map((todo, index)=>
            <SortableTodoItem key={todo.id} index={index} value={todo} />
          )}
        </ul>
     })

     return (
       <section className="main">
         {this.renderToggleAll(completedCount)}
         <SortableTodoList items={filteredTodos} onSortEnd={this.handleSort} />
         {this.renderFooter(completedCount)}
       </section>
     )
   }
 }
