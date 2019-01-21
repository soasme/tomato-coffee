import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import './App.css';

import Dashboard from './Dashboard';

import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';

class Callback extends Component {

  constructor(props){
    super(props)
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    this.saveToken()
  }

  saveToken = async () => {
    const res = await fetch("/v1/auth/code" + this.props.location.search)
    const data = await res.json()
    localStorage.setItem("profile", JSON.stringify(data))
    this.setState({user: data})
  }

  render () {
    if (this.state.user) {
      return <Redirect to="/app"/>
    }
    return <p>Signing in...</p>
  }
}

const AppRouter = () => (
  <Router>
    <div>
      <Route path="/" exact component={Home} />
      <Route path="/about" component={About} />
      <Route path="/app" component={Dashboard} />
      <Route path="/accounts/signin" component={SignIn} />
      <Route path="/auth/github/callback" component={Callback} />
    </div>
  </Router>
);

export default AppRouter;
