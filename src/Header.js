import React, { Component } from 'react';

import './Header.css';

export default class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <h1 className="Header-title">Tomato Coffee</h1>
        <div className="Header-user">
        @soasme
        </div>
      </header>
    )
  }
}
