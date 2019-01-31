import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

import ErrorBoundary from '../components/ErrorBoundary';

export default class GitHubCallback extends Component {

  constructor (props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.login();
  }

  login = async () => {
    const res = await fetch("/v1/auth/code" + this.props.location.search)
    const data = await res.json()
    localStorage.setItem("profile", JSON.stringify(data))
    this.setState({ user: data})
  }

  render () {
    const { user } = this.state;

    if (user) {
      return <Redirect to="/app" />;
    } else {
      return (
        <ErrorBoundary>
          <p>Signing In...</p>
        </ErrorBoundary>
      );
    }
  }

  
}