import React from 'react';
import { shallow } from 'enzyme';

import { Link } from "react-router-dom";
import Home from './Home';

test("Show 'Launch App' link", () => {
  const e = shallow(<Home />);
  expect(e.find(Link).exists()).toBeTruthy();
})
