import React, { Component } from 'react';

import './Header.css';
import logo from './logo.png';

// Logo: https://preview.freelogodesign.org/?lang=EN&name=&logo=91d87525-cc17-4e59-8dd5-15f14cf78d3d

export default class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <h1 className="Header-title">
          <img src={logo} className="logo" alt="Tomato Coffee"/>
          Tomato Coffee
        </h1>
        <div className="Header-user">
          {this.props.user.name}
        </div>
      </header>
    )
  }
}
