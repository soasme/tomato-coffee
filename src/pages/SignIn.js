import React, { Component } from 'react';

import SignInButton from '../components/SignInButton';
import ErrorBoundary from '../components/ErrorBoundary';

class SignIn extends Component {

  redirectToGitHub = async () => {
    const authorizeRes = await fetch("/v1/auth/login")
    const authorise = await authorizeRes.json()
    const authorizeURL = authorise['url']
    window.location.href=  authorizeURL;
    return new Promise(() => {});
  }

  render () {
    return (
      <div className="SignIn">
        <ErrorBoundary>
          <SignInButton onSignIn={this.redirectToGitHub}/>
        </ErrorBoundary>
      </div>
    )
  }
}

export default SignIn;
