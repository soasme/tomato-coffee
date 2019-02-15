import React, { Component } from 'react';

import { Redirect } from "react-router-dom";
import moment from 'moment';

import Header from '../components/Header';
import History from '../components/History';
import Pomodoro from '../components/Pomodoro';
import ErrorBoundary from '../components/ErrorBoundary';

import './Dashboard.css';

export default class Dashboard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      error: null,
      auth: null,
      timers: {},
      events: {},
    }
  }

  componentDidMount () {
    this.login()
  }

  login = async () => {
    var profile = localStorage.getItem("profile")
    if (profile) {
      profile = JSON.parse(profile)
    }
    if (profile) {
      const loginRes = await fetch("/v1/users", {
        headers: {
          'Authorization': 'Bearer ' + profile.token.access_token
        }
      })
      const user = await loginRes.json()
      if (user) {
        this.setState({auth: user})
        return
      } else {
        this.setState({auth: false})
      }
    } else {
      this.setState({auth: false})
    }
  }

  saveTimer = async ({ startTime }) => {
    const res = await fetch("/v1/timers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      },
      body: JSON.stringify({
        started_at: moment(startTime).unix(),
        ended_at: moment().unix()
      })
    })
    if (res.status !== 201) {
      throw new Error("Server responsed " + res.status)
    }
  }

  loadEvents = async ({ startTime, endTime }) => {
    try {
      const events = {}
      const timers = {}
      const res = await fetch("/v1/timers?started_at_gte=" +  startTime.unix() + "&ended_at_lte=" + endTime.unix(), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
        }
      })
      const rawTimers = await res.json()
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

  render () {
    if (this.state.auth === null) {
      return <p>Signin in...</p>
    }

    if (this.state.auth === false) {
      return <Redirect to={'/accounts/signin'} />
    }

    const { auth, timers, events } = this.state
    return (
      <ErrorBoundary>
        <div className="dashboard">
          <Header user={ auth }/>
          <div style={{display: "flex"}}>
            <div className="sidebar">
              <Pomodoro onSubmit={this.saveTimer} />
            </div>
            <div className="container">
              <History timers={timers} events={events} onUpdate={this.loadEvents} />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}
