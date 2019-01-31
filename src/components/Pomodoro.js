import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import PropTypes from 'prop-types';
import moment from 'moment';
import { interpret } from 'xstate/lib/interpreter';
import { pad } from '../Utils';

import './Pomodoro.css';

import CancelButton from './CancelButton';
import PomodoroFSM from './PomodoroFSM';

export default class Pomodoro extends Component {

  constructor (props) {
    super(props)

    this.state = {
      current: this.props.initialState ? this.props.initialState : PomodoroFSM.initialState,
    }
    this.service = interpret(PomodoroFSM)
      .onTransition(current => {
        this.setState({ current });
      });
  }

  componentDidMount () {
    this.service.start(this.state.current);
  }

  componentWillUnmount() {
    this.service.stop();
  }

  startPomodoro = () => {
    this.service.send({
      type: "ACTIVATE",
      startTime: moment().format(),
      endTime: moment().add(this.props.workingCountdownSeconds, 'seconds').format(),
    })
  }

  endPomodoro = () => {
    this.service.send({
      type: "DONE"
    })
  }

  submitPomodoro = async (e) => {
    this.service.send({
      type: 'SUBMIT',
    })
    try {
      if (this.props.onSubmit) {
        await this.props.onSubmit(this.state.current.context)
      }
      this.service.send({
        type: 'DONE',
        error: null,
        startTime: moment(),
        endTime: moment().add(this.props.restingCountdownSeconds, 'seconds'),
      })
    } catch (error) {
      this.service.send({
        type: 'ERROR',
        error: error.toString()
      })
    }
    if (e) {
      e.preventDefault();
    }
  }

  cancelPomodoro = () => {
    this.service.send({
      type: 'CANCEL',
    })
  }

  handleClick = (e) => {
    const { current } = this.state;
    if (current.matches("idle")) {
      this.startPomodoro();
    } else if (current.matches("extending")) {
      this.submitPomodoro();
    }
    e && e.preventDefault();
  }

  handleCancel = (e) => {
    this.cancelPomodoro()
    e && e.preventDefault();
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

  renderTimer = ({ formatted, completed }) => {
    if (completed) {
      return <span>You finished a Pomodoro Timer!</span>;
    }
    const { minutes, seconds} = formatted;
    return <span>{minutes}:{seconds}</span>;
  }

  render() {
    const { current } = this.state;
    return (
      <div className="pomodoro" onClick={this.handleClick}>
        <div className="pomodoro-container">
          {current.matches("idle") && <span>Start Pomodoro Timer</span> }
          {(current.matches("working") || current.matches("resting")) &&
            <Countdown
              onComplete={this.endPomodoro}
              onTick={this.renderDocumentTitle}
              date={moment(current.context.endTime).toDate()}
              renderer={this.renderTimer}/>}
         {(current.matches("extending") || current.matches("syncing")) && <span>Click to take a break!</span> }
        </div>
        {!current.matches("idle") && <CancelButton onCancel={this.handleCancel} />}
      </div>
    )
  }
}

Pomodoro.propTypes = {
  initialState: PropTypes.any,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  workingCountdownSeconds: PropTypes.number,
  restingCountdownSeconds: PropTypes.number,
}

Pomodoro.defaultProps = {
  workingCountdownSeconds: 60 * 25,
  restingCountdownSeconds: 60 * 5,
}