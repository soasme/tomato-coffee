import React, { Component } from 'react';

import './Tomato.css';

import Countdown from './Countdown';
import Database from './Database';
import History from './History';

export default class Tomato extends Component {

  constructor(props) {
    super(props)

    this.state = {
      db: new Database()
    }
  }

  onCountdownonTransition = (data) => {
    if (data.type === "DONE") {
      this.loadRecords()
    }
  }

  loadRecords = async () => {

  }

  render() {
    return (
      <div className="Tomato">
        <Countdown
          db={this.state.db}
          onTransition={this.onCountdownonTransition} />
        <History
          db={this.state.db} />
      </div>
    )
  }
}