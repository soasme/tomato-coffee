import React from 'react';
import { shallow } from 'enzyme';
import Countdown from './Countdown';

test("Show 'start tomato timer' initially.", () => {
  const e = shallow(<Countdown />);
  expect(e).toContainReact(<span className="Countdown-start">Start Tomato Timer</span>);
})

test("Start counting down when clicking the start button", () => {
  const e = shallow(<Countdown />);
  e.find(".Countdown").simulate("click");
  expect(e.find(".Countdown-timer").exists()).toBeTruthy();
})

test("Cancle the working timer", () => {
  const e = shallow(<Countdown />);
  e.find(".Countdown").simulate("click");
  e.find(".Countdown-stop").simulate("click");

  expect(e.find(".Countdown-timer").exists()).toBeFalsy();
  expect(e).toContainReact(<span className="Countdown-start">Start Tomato Timer</span>);
})
