import React, { Component } from 'react';

import moment from 'moment';

import './History.css';

export default class History extends Component {

  constructor(props) {
    super(props)

    this.state = {
      refreshTime: this.props.refreshTime,
      tomatoes: [],
    }
    console.log("init", props)
  }

  componentDidMount() {
    this.loadTomatoes()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshTime != this.state.refreshTime) {
      this.loadTomatoes()
    }
  }

  loadTomatoes = async () => {
    const tomatoes = await this.props.db.getTomatoes()
    this.setState({ tomatoes: tomatoes })
  }

  renderTime = (timestamp) => {
    return moment(timestamp).format('HH:mm');
  }

  render() {
    return (
      <div className="History">
        {this.state.tomatoes.map((tomato) => (
          <div className="Record" key={tomato._id}>
            <span className="Record-timerange">
              {this.renderTime(tomato.startTime)} - {this.renderTime(tomato.endTime)}
            </span>
            &nbsp;
            <span className="Record-content">{tomato.description}</span>
          </div>
        ))}
      </div>
    )
  }
}