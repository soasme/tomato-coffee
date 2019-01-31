import React, { Component } from 'react';
import TodoList from './TodoList';
import TodoHeader from './TodoHeader';

import g from '../g';
import { arrayMove } from '../Utils';

import './Todo.css';

const initialState = [
  // {
  //   text: 'Hello World',
  //   completed: false,
  //   id: 0
  // }
]

export default class Todo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: null,
      todos: initialState,
    }
  }

  componentDidMount = () => {
    this.loadTodos()
  }

  loadTodos = async () => {
    try {
      this.setState({todos: await g.loadTodos({ completed: false}), error: null})
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  addTodo = async (text) => {
    try {
      const success = await g.addTodo(text)
      if (success) {
      this.setState({todos: await g.loadTodos({ completed: false}), error: null})
      } else {
        this.setState({error: 'adding failed'})
      }
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  deleteTodo = async (id) => {
    try {
      const success = await g.deleteTodo(id)
      if (success) {
        this.setState({todos: await g.loadTodos({ completed: false}), error: null})
      } else {
        this.setState({error: 'delete failed'})
      }
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  editTodo = async (id, text) => {
    try {
      const success = await g.editTodo(id, text)
      if (success) {
        this.setState({todos: await g.loadTodos({ completed: false}), error: null})
      } else {
        this.setState({error: 'edit failed'})
      }
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  completeTodo = async (id) => {
    try {
      const todo = this.state.todos.filter(todo => todo.id === id)
      const success = await g.completeTodo(id, !todo[0].completed)
      if (success) {
        this.setState({todos: await g.loadTodos({ completed: false}), error: null})
      } else {
        this.setState({error: 'mark complete failed'})
      }
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  completeAll = async () => {
    const areAllMarked = this.state.todos.every(todo => todo.completed)
    const todos = this.state.todos.map(todo => {
      return {...todo, completed: !areAllMarked}
    })
    this.setState({todos})
  }

  clearCompleted = async () => {
    const todos = this.state.todos.filter(todo => todo.completed === false)
    this.setState({todos})
  }

  sortTodo = async ({oldIndex, newIndex}) => {
    const todos = arrayMove(this.state.todos.slice(), oldIndex, newIndex);
    console.log(todos, oldIndex, newIndex)
    this.setState({todos});
  }

  actions = {
    addTodo: this.addTodo,
    deleteTodo: this.deleteTodo,
    editTodo: this.editTodo,
    completeTodo: this.completeTodo,
    completeAll: this.completeAll,
    clearCompleted: this.clearCompleted,
    sortTodo: this.sortTodo,
  }

  render() {
    return (
      <div className="Todo">
        <TodoHeader addTodo={this.actions.addTodo} />
        <TodoList todos={this.state.todos} actions={this.actions} />
      </div>
    );
  }
}
