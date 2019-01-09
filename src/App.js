import React, { Component } from 'react';

import './App.css';

import Header from './Header';
import Tomato from './Tomato';
import Todo from './Todo';


const initialState = [
  {
    text: 'Hello World',
    completed: false,
    id: 0
  }
]

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Tomato />
        <Todo />
      </div>
    );
  }
}
