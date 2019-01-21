import React from 'react';
import { shallow } from 'enzyme';

import SignInButton from './SignInButton';

test("Show 'Sign In via GitHub' Initially", () => {
  const e = shallow(<SignInButton />);

  expect(e.find('.signin-button').text()).toEqual('Sign In via GitHub');
})

test("Show 'Sign In via GitHub...' after clicking", () => {
  const e = shallow(<SignInButton />);
  e.find('.signin-button').simulate('click');

  expect(e.find('.signin-button').prop('disabled')).toBeTruthy();
  expect(e.find('.signin-button').text()).toEqual('Sign In via GitHub...');
})
