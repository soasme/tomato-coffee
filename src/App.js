import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import GitHubCallback from './pages/GitHubCallback';

const AppRouter = () => (
  <Router>
    <div>
      <Route path="/" exact component={Home} />
      <Route path="/about" component={About} />
      <Route path="/app" component={Dashboard} />
      <Route path="/accounts/signin" component={SignIn} />
      <Route path="/auth/github/callback" component={GitHubCallback} />
    </div>
  </Router>
);

export default AppRouter;
