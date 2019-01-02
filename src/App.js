import React, { Component } from 'react';

import './App.css';

import Header from './Header';
import Tomato from './Tomato';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Tomato />
      </div>
    );
  }
}