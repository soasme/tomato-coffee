import React, { Component } from 'react';

import './Tomato.css';

import Countdown from './Countdown';
import Database from './Database';
import History from './History';
import moment from 'moment';

export default class Tomato extends Component {

  constructor(props) {
    super(props)

    this.state = {
      db: new Database(),
      refreshTime: moment(),
    }
  }

  onCountdownonTransition = (data) => {
    if (data.type === "DONE") {
      this.setState({ refreshTime: moment() })
    }
  }

  render() {
    return (
      <div className="Tomato">
        <Countdown
          db={this.state.db}
          onTransition={this.onCountdownonTransition} />
        <History
          refreshTime={this.state.refreshTime}
          db={this.state.db} />
      </div>
    )
  }
}