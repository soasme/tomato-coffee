import React, { Component } from 'react';

import { Redirect } from "react-router-dom";
import moment from 'moment';

import Header from '../Header';
import Todo from '../Todo';
import History from '../History';
import Pomodoro from '../components/Pomodoro';

import './Dashboard.css';

export default class Dashboard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      error: null,
      auth: null
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
      try {
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
      } catch (error) {
        this.setState({error: 'Something went wrong. Please refresh the page later.'})
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

  render () {
    if (this.state.error) {
      return <p>{this.state.error}</p>
    }

    if (this.state.auth === null) {
      return <p>Signin in...</p>
    }

    if (this.state.auth === false) {
      return <Redirect to={'/accounts/signin'} />
    }

    const { auth } = this.state
    return (
      <div className="Dashboard">
        <Header user={ auth }/>
        <div style={{display: "flex"}}>
          <div className="sidebar">
            <Pomodoro onSubmit={this.saveTimer} />
            <Todo />
          </div>
          <div className="container">
            <History />
          </div>
        </div>
      </div>
    )
  }
}
