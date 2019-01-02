import React, { Component } from 'react';

import './Tomato.css';

import Countdown from './Countdown';

export default class Tomato extends Component {

  render() {
    return (
      <div className="Tomato">
        <Countdown />
        <div className="Tomato-history">
        history
        </div>
      </div>
    )
  }
}