import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './SignInButton.css';

class SignInButton extends Component {

  constructor(props) {
    super(props)

    this.state = {
      signing: false,
      error: null,
    }
  }

  handleClick = async () => {
    this.setState({
      signing: true,
      error: null,
    })
    try {
      await this.props.onSignIn();
    } catch (error) {
      this.setState({
        signing: false,
        error: 'Something went wrong. Please refresh and try later.',
      })
    }
  }

  render() {
    return <>
      <button className="signin-button" onClick={this.handleClick} disabled={this.state.signing}>
        Sign In via GitHub{this.state.signing ? '...' : ''}
      </button>
      {this.state.error &&  <div className="signin-button-error">{this.state.error}</div> }
    </>
  }
}

SignInButton.propTypes = {
  onSignIn: PropTypes.func.isRequired,
}

export default SignInButton;
