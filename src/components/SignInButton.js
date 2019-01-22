import React, { Component } from 'react';

import './SignInButton.css';

class SignInButton extends Component {

  constructor(props) {
    super(props)

    this.state = {
      signing: false,
      error: null,
    }
  }

  redirect = async () => {
    this.setState({
      signing: true,
      error: null,
    })
    try {
      // TODO: replace by this.props.onSignIn
      const authorizeRes = await fetch("/v1/auth/login")
      const authorise = await authorizeRes.json()
      const authorizeURL = authorise['url']
      window.location.href=  authorizeURL;
      return new Promise(() => {});
    } catch (error) {
      this.setState({
        signing: false,
        error: 'Something went wrong. Please refresh and try later.',
      })
    }
  }

  render() {
    return <>
      <button className="signin-button" onClick={this.redirect} disabled={this.state.signing}>
        Sign In via GitHub{this.state.signing ? '...' : ''}
      </button>
      {this.state.error &&  <div className="signin-button-error">{this.state.error}</div> }
    </>
  }
}

export default SignInButton;
