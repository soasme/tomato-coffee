import React, { Component } from 'react';

import moment from 'moment';
import Calendar from 'react-calendar';
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
    }
  }

  handleCalendarChange = value => {
    this.setState({
      startTime: moment(value[0]).format(),
      endTime: moment(value[1]).format(),
    }, () => this.props.onUpdate({
      startTime: moment(value[0]),
      endTime: moment(value[1])
    }));
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
    const { timers, events } = this.props;
    const { showCalendar, startTime, endTime } = this.state;
    return (
      <div className="History">
        <h1>History</h1>
        {showCalendar ?
          <div style={{position: 'relative', width: '350px'}}>
            <Calendar
            className="calendar"
            selectRange={true}
            onChange={this.handleCalendarChange}
            value={[moment(startTime).toDate(), moment(endTime).toDate()]} />
            <CancelButton onCancel={this.toggleCalendarOff} />
          </div>
          :
          <div className="calendar-selected">
            Records in between &nbsp;
            <span style={{ borderBottom: 'solid 1px #ddd' }} onClick={this.toggleCalendarOn}>
              {moment(startTime).format("MM-DD")} - {moment(endTime).format("MM-DD")}
            </span>
          </div>
        }
        {Object.keys(events).sort((d1, d2) => {
          if (moment(d1).isBefore(moment(d2))) { return 1 } else { return -1 }
        }).map((date) => {
          const dayEvents = events[date].sort((e1, e2) => {
            if (this.getEventTime(e1).isBefore(this.getEventTime(e2))) {
              return 1;
            } else {
              return -1;
            }
          });
          return (
            <div key={date.toString()}>
              <h3>{this.renderDate(date)}</h3>
              {dayEvents.map(event => {
                let obj;
                obj = timers[event.id]
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
