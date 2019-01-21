import React from 'react';
import { shallow } from 'enzyme';
import CancelButton from './components/CancelButton';

import Countdown, {CountdownLabel } from './Countdown';

test("Show 'start tomato timer' initially.", () => {
  const e = shallow(<Countdown />);

  // Initially, there should be a starting label.
  const ui = e.find(CountdownLabel);
  expect(ui.shallow().exists()).toBeTruthy();
  expect(ui.prop('text')).toEqual('Start Tomato Timer');
})

test("Start counting down when clicking the start button", () => {
  const e = shallow(<Countdown />);

  // Click start
  e.find(".Countdown").simulate("click");

  // Discover the timer
  expect(e.find(".Countdown-timer").exists()).toBeTruthy();
})

test("Cancle the working timer", () => {
  const e = shallow(<Countdown />);

  // Click start, and then click cancel
  e.find(".Countdown").simulate("click");
  e.find(CancelButton).shallow().simulate('click');

  // After canceling, it should render the initial button.
  const ui = e.find(CountdownLabel);
  expect(ui.shallow().exists()).toBeTruthy();
  expect(ui.prop('text')).toEqual('Start Tomato Timer');

  // And there should be no timer.
  expect(e.find(".Countdown-timer").exists()).toBeFalsy();
})
