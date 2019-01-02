import React, { Component } from 'react';

import { default as CountdownTimer } from 'react-countdown-now';

const Completionist = () => <span>You are good to go!</span>;

export default class Countdown extends Component {

  constructor(props) {
    super(props)

    this.state = {
      stopped: true,
      stoppedAt: null,
    }
  }

  getCountdownSeconds = () => {
    return Date.now() + (this.props.countdownSeconds || 25 * 60 * 1000);
  }

  startTimer = () => {
    this.setState({
      stopped: false,
      stoppedAt: this.getCountdownSeconds(),
    })
  }

  renderTimer = ({ formatted, completed }) => {
    /* The renderTimer function should align the spec of
    *  https://github.com/ndresx/react-countdown#custom-renderer-with-completed-condition
    */
    if (completed) {
      return <Completionist />;
    }
    const { minutes, seconds} = formatted;
    return <span>{minutes}:{seconds}</span>;
  }

  render() {
    if (this.state.stopped === true) {
      return <div onClick={this.startTimer}>Start Tomato Timer</div>
    }
    return (
      <CountdownTimer
        date={this.state.stoppedAt}
        renderer={this.renderTimer}
        />
    )
  }
}