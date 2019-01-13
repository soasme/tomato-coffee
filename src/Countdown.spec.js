import React from 'react';
import { shallow } from 'enzyme';
import Countdown from './Countdown';

test("Show 'start tomato timer' initially.", () => {
  const e = shallow(<Countdown />); 
  expect(e).toContainReact(<span className="Countdown-start">Start Tomato Timer</span>);
})

test("Start counting down when click on the start button", () => {
  const e = shallow(<Countdown />);
  e.find(".Countdown").simulate("click");
  expect(e.find(".Countdown-timer")).toBeTruthy();
})