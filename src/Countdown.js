import React, { Component } from 'react';
import { default as CountdownTimer } from 'react-countdown-now';
import { Machine, State, actions } from 'xstate';
import moment from 'moment';
import { interpret } from 'xstate/lib/interpreter';

import './Countdown.css';

const { assign } = actions;
const Completionist = () => <span>You finished a Tomato Timer!</span>;

const WORK_COUNTDOWN_SECONDS = 60 * 25;
const REST_COUNTDOWN_SECONDS = 60 * 5;

const countdownMachine = Machine({
  id: 'countdown',
  initial: 'idle',
  context: {
    startTime: null,
    endTime: null,
  },
  states: {
    idle: {
      on: {
        ACTIVATE: {
          target: 'working',
          actions: 'countdown',
        }
      }
    },
    working: {
      on: {
        CANCLE: { target: 'idle' },
        DONE: { target: 'extending' },
      },
    },
    extending: {
      on: {
        CANCLE: { target: 'idle' },
        SUBMIT: { target: 'syncing' },
      }
    },
    syncing: {
      on: {
        DONE: { target: 'resting', actions: 'countdown'},
        ERROR: { target: 'extending' },
      }
    },
    resting: {
      on: {
        CANCLE: {
          target: 'idle',
        },
        DONE: {
          target: 'idle',
          
        }
      }
    }
  },
}, {
  actions: {
    countdown: assign((ctx, event) => {
      return {
        startTime: event.startTime,
        endTime: event.endTime
      }
    })
  }
});

export default class Countdown extends Component {

  state = {
    current: countdownMachine.initialState
  };

  service = interpret(countdownMachine)
    .onTransition(current => {
      this.setState({ current });
    });

  componentDidMount() {
    if (this.props.initialState) {
      this.setState({ current: this.props.initialState });
    }
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  activate = () => {
    const start = moment();
    const end = start.add(this.props.countdownSeconds || WORK_COUNTDOWN_SECONDS, 'seconds');
    this.service.send({
      type: "ACTIVATE",
      startTime: start,
      endTime: end,
    })
  }

  workDone = () => {
    this.service.send({
      type: "DONE"
    })
  }

  restDone = () => {
    this.service.send({
      type: "DONE"
    })
  }

  saveTimer = async () => {
    const { startTime, endTime } = this.state.current.context;
    try {
      const res = await fetch("/v1/timers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
        },
        body: JSON.stringify({
          started_at: startTime.unix(),
          ended_at: moment().unix()
        })
      })

      if (res.status === 201) {
        this.service.send({
          type: 'DONE',
          startTime: moment(),
          endTime: moment().add(this.props.countdownSeconds || REST_COUNTDOWN_SECONDS, 'seconds'),
        })
      } else {
        this.service.send({
          type: 'ERROR',
          error: new Error("status: " + res.status)
        })
      }
    } catch (error) {
      this.service.send({
        type: 'ERROR',
        error: error
      })
    }
  }

  sync = (e) => {
    this.service.send({
      type: 'SUBMIT',
    })

    this.saveTimer()

    e.preventDefault()
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
    const { current } = this.state;
    const { send } = this.service;

    if (current.matches("idle")) {
      return (
        <div className="Countdown" onClick={this.activate}>
          <div className="Countdown-container">
            <span className="Countdown-start">Start Tomato Timer</span>
          </div>
        </div>
      )
    }

    if (current.matches("working") || current.matches("resting")) {
      const onComplete = current.matches("working") ? this.workDone : this.restDone;
      const { endTime } = current.context;
      return (
        <div className="Countdown">
          <div className="Countdown-container">
            <div className="Countdown-timer">
              <CountdownTimer
                onComplete={onComplete}
                date={endTime.toDate()}
                renderer={this.renderTimer}/>
            </div>
          </div>
          <div className="Countdown-stop" onClick={() => send("CANCLE")}>x</div>
        </div>
      )
    }

    if (current.matches("extending") || current.matches("syncing")) {
      const onClick = current.matches("syncing") ? (e) => {} : this.sync;
      return (
        <div className="Countdown" onClick={onClick}>
          <div className="Countdown-container">
            <span className="Countdown-start">Click to Take a break.</span>
          </div>
          <div className="Countdown-stop" onClick={() => send("CANCLE")}>x</div>
        </div>
      )
    }

    throw new Error("Unknown state: " + current.value);
  }
}
