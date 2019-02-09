import React, { Component } from 'react';

import moment from 'moment';
import Calendar from 'react-calendar';
import g from '../g';
import CancelButton from './CancelButton';
import './History.css';

export default class History extends Component {

  constructor(props) {
    super(props)

    this.state = {
      refreshTime: this.props.refreshTime,
      startTime: moment().subtract(3, 'days').format(),
      endTime: moment().format(),
      showCalendar: false,
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

      this.setState({timers: timers, events: events})
    } catch (error) {
      console.log(error)
    }
  }

  handleCalendarChange = value => {
    this.setState({
      startTime: moment(value[0]).format(),
      endTime: moment(value[1]).format(),
    }, () => this.loadEvents());
  }

  renderDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  }

  renderTime = (timestamp) => {
    return moment(new Date(timestamp)).format('HH:mm');
  }

  getEventTime = (event) => {
    if (event.type === 'todo') {
      return moment(this.state.todos[event.id].completed_at * 1000);
    } else if (event.type === 'timer') {
      return moment(this.state.timers[event.id].ended_at * 1000);
    } else {
      throw new Error('unknown event type: ' + event.type);
    }
  }

  toggleCalendarOn = () => {
    this.setState({ showCalendar: true })
  }

  toggleCalendarOff = () => {
    this.setState({ showCalendar: false })
  }

  render() {
    return (
      <div className="History">
        <h1>History</h1>
        {this.state.showCalendar ?
          <div style={{position: 'relative', width: '350px'}}>
            <Calendar
            className="calendar"
            selectRange={true}
            onChange={this.handleCalendarChange}
            value={[moment(this.state.startTime).toDate(), moment(this.state.endTime).toDate()]} />
            <CancelButton onCancel={this.toggleCalendarOff} />
          </div>
          :
          <div className="calendar-selected">
            Records in between &nbsp;
            <span style={{ borderBottom: 'solid 1px #ddd' }} onClick={this.toggleCalendarOn}>
              {moment(this.state.startTime).format("MM-DD")} - {moment(this.state.endTime).format("MM-DD")}
            </span>
          </div>
        }
        {Object.keys(this.state.events).sort((d1, d2) => {
          if (moment(d1).isBefore(moment(d2))) { return 1 } else { return -1 }
        }).map((date) => {
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
                obj = this.state.timers[event.id]
                return (
                  <div className="Record" key={"timer" + event.id}>
                    <span className="Record-timerange">
                      {this.renderTime(obj.started_at * 1000)} - {this.renderTime(obj.ended_at * 1000)}
                    </span>
                    &nbsp;
                    &nbsp;
                    <span role="img" aria-labelledby="Tomato" className="Record-content" style={{fontSize: '2rem'}}>🍅</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
