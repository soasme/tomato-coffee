import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from "react-router-dom";

import Dashboard from './Dashboard';

test("Dashboard requires login", () => {
  const e = shallow(<Dashboard />);
  expect(e.find(Redirect).exists()).toBeTruthy();
  expect(e.find('.dashboard').exists()).toBeFalsy();
})

test("Load Dashboard", () => {
  const e = shallow(<Dashboard />);
  e.setState({ auth: { username: 'test' }});
  expect(e.find('.dashboard').exists()).toBeTruthy();
})