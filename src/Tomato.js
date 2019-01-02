import React, { Component } from 'react';

import './Tomato.css';

import Countdown from './Countdown';
import History from './History';

export default class Tomato extends Component {

  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

  onStart = (delta) => {
    console.log('start', delta);
  }

  onComplete = (delta) => {
    console.log('complete', delta);
  }

  onRest = (delta) => {
    console.log('rest', delta);
  }

  onCancle = () => {
    console.log('cancle');
  }

  render() {
    return (
      <div className="Tomato">
        <Countdown
          startState="PENDING"
          onStart={this.onStart}
          onRest={this.onRest}
          onComplete={this.onComplete} />
        <History />
      </div>
    )
  }
}