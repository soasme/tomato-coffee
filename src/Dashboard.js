import React, { Component } from 'react';

import { Redirect } from "react-router-dom";


import Header from './Header';
import Tomato from './Tomato';
import Todo from './Todo';
import History from './History';

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
      const loginRes = await fetch("/v1/users", {
        headers: {
          'Authorization': 'Bearer ' + profile.token.access_token
        }
      })
      const user = await loginRes.json()
      if (user) {
        this.setState({auth: user})
        return
      }
    }
    this.setState({error: 'unauthorized'})
  }

  render () {
    if (this.state.error) {
      if (this.state.error === 'unauthorized') {
        return <Redirect to={'/accounts/signin'} />
      } else {
        return <p>{this.state.error}</p>
      }
    }
    if (!this.state.auth) {
      return <p>Signin in...</p>
    }
    const { auth } = this.state
    return (
      <div className="Dashboard">
        <Header user={ auth }/>
        <div style={{display: "flex"}}>
          <div className="sidebar">
            <Tomato />
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
