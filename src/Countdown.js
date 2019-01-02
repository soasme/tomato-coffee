import React, { Component } from 'react';

import { default as CountdownTimer } from 'react-countdown-now';

import './Countdown.css';

const Completionist = () => <span>You are good to go!</span>;
const DEFAULT_COUNTDOWN_SECONDS = 1 * 60 * 1000;

export default class Countdown extends Component {
  // The Countdown component displays the countdown timer.

  constructor(props) {
    super(props)

    this.state = {
      // state `stopped` controls if the timer stopped.
      stopped: true,

      // state `stoppedAt` defines when the timer stops.
      // It should be a Date object of a future time.
      stoppedAt: null,
    }
  }

  getCountdownSeconds = () => {
    // Under the context of Tomato Timer, the countdown seconds is always 25 MIN,
    // meaning the time should be now() + delta(25.minutes).
    return Date.now() + (this.props.countdownSeconds || DEFAULT_COUNTDOWN_SECONDS);
  }

  startTimer = () => {
    if (this.state.stopped) {
      this.setState({
        stopped: false,
        stoppedAt: this.getCountdownSeconds(),
      })
    }
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
    return (
      <div className="Countdown" onClick={this.startTimer}>
        { this.state.stopped
          ? <span class="Countdown-start">Start Tomato Timer</span>
          : <CountdownTimer
              className="Countdown-timer"
              date={this.state.stoppedAt}
              renderer={this.renderTimer}
          />
        } 
      </div>
    )
  }
}