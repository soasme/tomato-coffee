import React, { Component } from 'react';
import { default as CountdownTimer } from 'react-countdown-now';
import { Machine } from 'xstate';
import moment from 'moment';
import { interpret } from 'xstate/lib/interpreter';

import './Countdown.css';

const Completionist = () => <span>You finished a Tomato Timer!</span>;

const WORK_COUNTDOWN_SECONDS = 1000; //25* 60 * 1000;
const REST_COUNTDOWN_SECONDS = 1000; //5 * 60 * 1000;

const countdownMachine = Machine({
  id: 'countdown',
  initial: 'idle',
  states: {
    idle: {
      on: { ACTIVATE: 'working' }
    },
    working: {
      on: { CANCLE: 'idle', DONE: 'extending'}
    },
    extending: {
      on: { CANCLE: 'idle', SUBMIT: 'syncing' }
    },
    syncing: {
      on: { DONE: 'resting', ERROR: 'extending' }
    },
    resting: {
      on: { CANCLE: 'idle', DONE: 'idle' }
    }
  }
});

export default class Countdown extends Component {

  state = {
    startTime: null,
    endTime: null,
    description: "",
    current: countdownMachine.initialState
  };

  service = interpret(countdownMachine)
    .onTransition(current => {
      this.setState({ ...current.event, current });
      if (this.props.onTransition) {
        this.props.onTransition({ ...current.event, current });
      }
    });

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  activate = () => {
    const now = moment()
    this.service.send({
      type: "ACTIVATE",
      startTime: now,
      endTime: now + (this.props.countdownSeconds || WORK_COUNTDOWN_SECONDS)
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
    try {
      const res = await fetch("/v1/timers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
        },
        body: JSON.stringify({
          started_at: this.state.startTime.unix(),
          ended_at: moment().unix()
        })
      })

      if (res.status === 201) {
        this.service.send({
          type: 'DONE',
          startTime: moment(),
          endTime: moment() + (this.props.countdownSeconds || REST_COUNTDOWN_SECONDS),
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

    const { endTime } = this.state;

    if (current.matches("working") || current.matches("resting")) {
      const onComplete = current.matches("working") ? this.workDone : this.restDone;
      return (
        <div className="Countdown">
          <div className="Countdown-container">
            <div className="Countdown-timer">
              <CountdownTimer
                onComplete={onComplete}
                date={endTime}
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
