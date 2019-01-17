import React, { Component } from 'react';

import moment from 'moment';
import Calendar from 'react-calendar';
import g from './g';

import TodoItem from './TodoItem';

import './History.css';

export default class History extends Component {

  constructor(props) {
    super(props)

    this.state = {
      refreshTime: this.props.refreshTime,
      startTime: moment().subtract(3, 'days').format(),
      endTime: moment().format(),
      todos: {},
      timers: {},
      events: {},
    }
  }

  componentDidMount() {
    this.loadEvents()
  }

  loadEvents = async () => {
    try {
      const events = {}

      const todos = {}
      const rawTodos = await g.loadTodos({
        completed: true,
        startTime: moment(this.state.startTime).unix(),
        endTime: moment(this.state.endTime).unix()
      })
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
      const rawTimers = await g.loadTimers({
        startTime: moment(this.state.startTime).unix(),
        endTime: moment(this.state.endTime).unix()
      })
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

  deleteTodo = async (id) => {
    try {
      const success = await g.deleteTodo(id)
      if (success) {
        await this.loadEvents()
      } else {
        this.setState({error: 'delete failed'})
      }
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  editTodo = async (id, text) => {
    try {
      const success = await g.editTodo(id, text)
      if (success) {
        await this.loadEvents()
      } else {
        this.setState({error: 'edit failed'})
      }
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  completeTodo = async (id) => {
    try {
      const todo = this.state.todos[id]
      const success = await g.completeTodo(id, !todo.completed)
      if (success) {
        await this.loadEvents()
      } else {
        this.setState({error: 'mark complete failed'})
      }
    } catch (error) {
      this.setState({error: error.toString()})
    }
  }

  handleCalendarChange = value => {
    this.setState({
      startTime: moment(value[0]).format(),
      endTime: moment(value[1]).format(),
    });
    this.loadEvents()
  }

  renderDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  }

  renderTime = (timestamp) => {
    return moment(new Date(timestamp)).format('HH:mm');
  }

  renderTodo = (todo) => {
    const actions = {
      deleteTodo: this.deleteTodo,
      editTodo: this.editTodo,
      completeTodo: this.completeTodo,
    }
    return (
      <ul className="todo-list">
        <TodoItem key={todo.id} todo={todo} {...actions} />
      </ul>
    )
  }

  getEventTime = (event) => {
    if (event.type === 'todo') {
      return moment(this.state.todos[event.id].completed_at * 1000);
    } else if (event.type === 'timer') {
      console.log(this.state.timers)
      return moment(this.state.timers[event.id].ended_at * 1000);
    } else {
      throw new Error('unknown event type: ' + event.type);
    }
  }

  render() {
    return (
      <div className="History">
        <h1>History</h1>
        <Calendar
          selectRange={true}
          onChange={this.handleCalendarChange}
          value={[moment(this.state.startTime).toDate(), moment(this.state.endTime).toDate()]} />
        {Object.keys(this.state.events).sort().reverse().map((date) => {
          const events = this.state.events[date].sort((e1, e2) => {
            if (this.getEventTime(e1).isBefore(this.getEventTime(e2))) {
              return 1;
            } else {
              return -1;
            }
          });
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
                      <span className="Record-content">
                        {this.renderTodo(obj)}
                      </span>
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
                      <span className="Record-content" style={{fontSize: '2rem'}}> 🍅 </span>
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
