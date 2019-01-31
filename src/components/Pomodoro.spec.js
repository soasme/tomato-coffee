import React from 'react';
import { shallow } from 'enzyme';

import Countdown from 'react-countdown-now';
import CancelButton from './CancelButton';

import Pomodoro from './Pomodoro';

test("Show 'start tomato timer' initially.", () => {
  const e = shallow(<Pomodoro />);
  expect(e.contains(<span>Start Pomodoro Timer</span>)).toBeTruthy();
})

test("Start counting down when clicking the start button", () => {
  const e = shallow(<Pomodoro />);

  // Click start
  e.find(".pomodoro").simulate("click", { preventDefault() {} });

  // Discover the timer
  expect(e.contains(<span>Start Pomodoro Timer</span>)).toBeFalsy();
  expect(e.find(Countdown).exists()).toBeTruthy();
})

test("Cancle the working timer", () => {
  const e = shallow(<Pomodoro />);

  // Click start, and then click cancel
  e.find(".pomodoro").simulate("click", { preventDefault() {} });
  e.find(CancelButton).shallow().simulate("click", { preventDefault() {} });

  // After canceling, it should render the initial button.
  expect(e.contains(<span>Start Pomodoro Timer</span>)).toBeTruthy();
  expect(e.find(Countdown).exists()).toBeFalsy();
})

test("Complete countdown", () => {
  const e = shallow(<Pomodoro workingCountdownSeconds={0} />);
  e.find(".pomodoro").simulate("click", { preventDefault() {} });
  expect(e.find(Countdown).shallow().contains(<span>You finished a Pomodoro Timer!</span>)).toBeTruthy();
})

