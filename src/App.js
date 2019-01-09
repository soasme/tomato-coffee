import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';

import Header from './Header';
import Tomato from './Tomato';
import Todo from './Todo';

const Index = () => (
  <div className="App">
    <Link to="/app/">Launch App</Link>
  </div>
);
const About = () => <h2>About</h2>;
const Dashboard = () => (
  <div className="App">
    <Header />
    <Tomato />
    <Todo />
  </div>
);

const AppRouter = () => (
  <Router>
    <div>
      <Route path="/" exact component={Index} />
      <Route path="/about/" component={About} />
      <Route path="/app/" component={Dashboard} />
    </div>
  </Router>
);


export default AppRouter;

// export default class App extends Component {

//   render() {
//     return (
//       <div className="App">
//         <Header />
//         <Tomato />
//         <Todo />
//       </div>
//     );
//   }
// }
