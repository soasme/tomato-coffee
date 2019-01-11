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
      refreshInterval: 10 * 1000,
      refreshTime: moment(),
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.state.db.syncRemote()
    }, this.state.refreshInterval)
  }

  synchronize = async () => {
    await this.state.db.syncRemote()
    this.setState({ refreshTime: moment() })
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
          onTransition={this.onCountdownonTransition} />
      </div>
    )
  }
}