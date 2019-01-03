import React, { Component } from 'react';
import { default as CountdownTimer } from 'react-countdown-now';
import { Machine } from 'xstate';

import Commit from './Commit';

import './Countdown.css';

const Completionist = () => <span>You finished a Tomato Timer!</span>;
//const DEFAULT_COUNTDOWN_SECONDS = 25 * 60 * 1000;
const DEFAULT_COUNTDOWN_SECONDS = 1000;

export default class Countdown extends Component {
  // The Countdown component displays the countdown timer.


  constructor(props) {
    super(props)

    /*
                       submit
      +-----------+ <------------+  +----------+
      |  syncing  |                 |  record  |
      +----+------+ +------------>  +-----+----+
          |            error             ^
          |                              |
          +---------------------------+  | tomato
                        success       |  | timeout
                                      v  +
                        start
      +---------+  +-------------->  +-----------+
      | pending |                    | countdown |
      +---------+  <--------------+  +-----------+
                      coffee
          ^           timeout         ^       +
          |                           |       |
          |                    cancle |       | cancle
          |                           |       |
          | confirm                   +       v
          |
          |                         +-----------+
          +-----------------------+ |  abandon  |
                                    +-----------+
      */

    this.state = {
      machine: Machine({
        initial: this.props.initial,
        context: {
          startedAt: null,
          stoppedAt: null,
        },
        states: {
          pending: {
            on: {
              START: 'countdown',
            }
          },
          countdown: {
            on: {
              CANCLE: 'pending',
              COMPLETE: 'success',
            }
          },
          aborted: {
            on: {
              REVERT: 'countdown',
              CONFIRM: 'pending',
            }
          },
          success: {
            initial: 'submitting',
            states: {
              submitting: {
                on: {
                  SUBMIT: ''
                }
              }
            }
          }
        }
      })
    }

    this.transitions = {
      "PENDING": {
        "START": "COUNTING",
      },
      "COUNTING": {
        "CANCEL": "PENDING",
        "COMPLETE": "STOPPED",
      },
      "STOPPED": {
        "CANCEL": "PENDING",
        "SAVE": "PENDING",
      }
    }

    this.state = {
      current: this.props.startState,

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

  transite = (action, newState) => {
    const transitions = this.transitions[this.state.current];
    if (!transitions) {
      throw new Error("invalid current state: " + this.state.current);
    }
    const next = transitions[action];
    if (!action) {
      throw new Error("invalid action: " + action);
    }
    this.setState({
      ...(newState || {}),
      current: next,
    });
  }

  startTimer = () => {
    if (this.state.current === "PENDING") {
      this.transite("START", {
        stoppedAt: this.getCountdownSeconds(),
      })
    }
  }

  stopTimer = () => {
    this.transite("CANCEL")
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
        <div className="Countdown-container">
        { this.state.current === "PENDING"
          ? <span className="Countdown-start">Start Tomato Timer</span>
          : <div className="Countdown-timer">
            <CountdownTimer
              onStart={this.props.onStart}
              onComplete={this.props.onComplete}
              date={this.state.stoppedAt}
              renderer={this.renderTimer}/>
            </div>
        } 
        </div>
        { this.state.current !== "PENDING" && 
          <div className="Countdown-stop" onClick={this.stopTimer}>x</div>
        }
      </div>
    )
  }
}