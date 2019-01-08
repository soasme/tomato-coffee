import React, { Component } from 'react';

import './App.css';

import Header from './Header';
import Tomato from './Tomato';
import Todo from './Todo';
import TodoHeader from './TodoHeader';

const initialState = [
  {
    text: 'Hello World',
    completed: false,
    id: 0
  }
]

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: initialState,
    }
  }

  addTodo = (text) => {
    const todos = [
      {
        id: this.state.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
        completed: false,
        text: text
      },
      ...this.state.todos
    ]
    this.setState({todos})
  }

  deleteTodo = (id) => {
    const todos = this.state.todos.filter(todo => todo.id !== id)
    this.setState({todos})
  }

  editTodo = (id, text) => {
    const todos = this.state.todos.map(todo =>
      todo.id === id ? {...todo, text} : todo
    )
    this.setState({todos})
  }

  completeTodo = (id) => {
    const todos = this.state.todos.map(todo =>
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    )
    this.setState({todos})
  }

  completeAll = () => {
    const areAllMarked = this.state.todos.every(todo => todo.completed)
    const todos = this.state.todos.map(todo => {
      return {...todo, completed: !areAllMarked}
    })
    this.setState({todos})
  }

  clearCompleted = () => {
    const todos = this.state.todos.filter(todo => todo.completed === false)
    this.setState({todos})
  }

  actions = {
    addTodo: this.addTodo,
    deleteTodo: this.deleteTodo,
    editTodo: this.editTodo,
    completeTodo: this.completeTodo,
    completeAll: this.completeAll,
    clearCompleted: this.clearCompleted
  }


  render() {
    return (
      <div className="App">
        <Header />
        <Tomato />
        <TodoHeader addTodo={this.actions.addTodo} />
        <Todo todos={this.state.todos} actions={this.actions} />
      </div>
    );
  }
}
