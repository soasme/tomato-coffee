import React, { Component } from 'react';

import './Tomato.css';

import Countdown from './Countdown';
import moment from 'moment';

export default class Tomato extends Component {

  constructor(props) {
    super(props)

    this.state = {
      refreshInterval: 10 * 1000,
      refreshTime: moment(),
    }
  }

  render() {
    return (
      <div className="Tomato">
        <Countdown />
      </div>
    )
  }
}
