import React, { Component } from 'react';

import moment from 'moment';
import g from './g';

import './History.css';

export default class History extends Component {

  constructor(props) {
    super(props)

    this.state = {
      refreshTime: this.props.refreshTime,
      todos: {},
      timers: {},
      events: {},
    }
  }

  componentDidMount() {
    this.loadEvents()
  }

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.refreshTime !== this.state.refreshTime) {
      this.loadTomatoes()
    }
  }*/

  /*loadTomatoes = async () => {
    const tomatoes = await this.props.db.getTomatoes()
    this.setState({ tomatoes: tomatoes })
  }*/

  loadEvents = async () => {
    try {
      const events = {}

      const todos = {}
      const rawTodos = await g.loadTodos()
      rawTodos.forEach(todo => {
        if (todo.completed) {
          todos[todo.id] = todo
          const date = moment(new Date(todo.completed_at * 1000)).hour(0).minute(0).second(0).toDate();
          if (!events[date]) {
            events[date] = []
          }
          console.log(date, moment(todo.completed_at * 1000));
          events[date].push({type: 'todo', id: todo.id})
        }
      });

      const timers = {}
      const rawTimers = await g.loadTimers()
      rawTimers.forEach(timer => {
        timers[timer.id] = timer
        const date = moment(new Date(timer.ended_at * 1000)).hour(0).minute(0).second(0).toDate();
        if (!events[date]) {
          events[date] = []
        }
        events[date].push({type: 'timer', id: timer.id})
      })

      this.setState({todos: todos, timers: timers, events: events})
    } catch (error) {
      console.log(error)
    }
  }

  renderDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  }

  renderTime = (timestamp) => {
    return moment(new Date(timestamp)).format('HH:mm');
  }

  render() {
    return (
      <div className="History">
        <h1>History</h1>
        {Object.keys(this.state.events).map((date) => {
          const events = this.state.events[date];
          return (
            <div key={date.toString()}>
              <h3>{this.renderDate(date)}</h3>
              {events.map(event => {
                let obj;
                if (event.type == 'todo') {
                  obj = this.state.todos[event.id]
                  return (
                    <div className="Record" key={"todo" + event.id}>
                      <span className="Record-timerange">
                        {this.renderTime(obj.completed_at * 1000)}
                      </span>
                      &nbsp;
                      <span className="Record-content">{obj.text}</span>
                    </div>
                  )
                } else if (event.type == 'timer') {
                  obj = this.state.timers[event.id]
                  return (
                    <div className="Record" key={"timer" + event.id}>
                      <span className="Record-timerange">
                        {this.renderTime(obj.started_at * 1000)} - {this.renderTime(obj.ended_at * 1000)}
                      </span>
                      &nbsp;
                      <span className="Record-content">Tomato timer completed.</span>
                    </div>
                  )
                }
                return <span>{event.id}</span>
              })}
            </div>
          )
        })}
      </div>
    )
  }
}