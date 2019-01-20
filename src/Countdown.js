import React, { Component } from 'react';
import { default as CountdownTimer } from 'react-countdown-now';
import { Machine, State, actions } from 'xstate';
import moment from 'moment';
import { interpret } from 'xstate/lib/interpreter';
import { pad } from './Utils';

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

    try {
      const frozenState = window.localStorage.getItem('countdown-state')
      const currentState = State.create(JSON.parse(frozenState));
      this.service.start(currentState);
    } catch (error) {
      this.service.start();
    }

    // TODO: A better solution is to intercept state change and then take snapshot.
    // But I couldn't figure it out how to make it.
    setInterval(this.takeSnapshot, 1000);
  }

  componentWillUnmount() {
    this.service.stop();
  }

  takeSnapshot = async () => {
    if (this.state.current.event.type !== 'xstate.init') {
      const frozenState = JSON.stringify(this.state.current);
      window.localStorage.setItem('countdown-state', frozenState);
    }
  }

  activate = () => {
    const start = moment();
    const end = moment().add(this.props.countdownSeconds || WORK_COUNTDOWN_SECONDS, 'seconds');
    this.service.send({
      type: "ACTIVATE",
      startTime: start.format(),
      endTime: end.format(),
    })
  }

  workDone = () => {
    window.document.title = 'Buzzzzzz, take a break | Tomato Coffee';
    this.service.send({
      type: "DONE"
    })
  }

  restDone = () => {
    window.document.title = 'Tomato Coffee';
    this.service.send({
      type: "DONE"
    })
  }

  saveTimer = async () => {
    const { startTime } = this.state.current.context;
    const rawStartTime = moment(startTime);
    try {
      const res = await fetch("/v1/timers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
        },
        body: JSON.stringify({
          started_at: moment(rawStartTime).unix(),
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

  renderDocumentTitle = (delta) => {
    if (delta !== undefined) {
      if (this.state.current.matches("extending")) {
        window.document.title = 'Buzzzz!!! Take a break | Tomato Coffee';
      } else {
        window.document.title = '' + pad(delta.minutes, 2) + ':' + pad(delta.seconds, 2) + ' | Tomato Coffee';
      }
    }
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
      const endTime = moment(current.context.endTime);
      return (
        <div className="Countdown">
          <div className="Countdown-container">
            <div className="Countdown-timer">
              <CountdownTimer
                onComplete={onComplete}
                onTick={this.renderDocumentTitle}
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
