import React, { Component } from 'react';

import moment from 'moment';

import './History.css';

export default class History extends Component {

  constructor(props) {
    super(props)

    this.state = {
      records: []
    }
  }

  componentDidMount() {
    this.setState({
      records: [
        {"id": 1, "start": 1546421940, "end": 1546422000, "content": "#tomatocoffee started."}
      ]
    })
  }

  renderTime = (timestamp) => {
    return moment(timestamp * 1000).format('LT');
  }

  render() {
    return (
      <div className="History">
        {this.state.records.map((record) => (
          <div className="Record" key="{record.id}">
            <span className="Record-timerange">
              {this.renderTime(record.start)} - {this.renderTime(record.end)}
            </span>
            &nbsp;
            <span className="Record-content">{record.content}</span>
          </div>
        ))}
      </div>
    )
  }
}