import React from 'react';
import Intro from '../Screens/styles';

import renderer from 'react-test-renderer';
import ProfileSetup from '../Screens/ProfileSetup';
import EmailVeri from '../Screens/EmailVeri';
import VeriScreen from '../Screens/VeriScreen';

test('renders correctly', () => {
  const treeProfile = renderer.create(<ProfileSetup />).toJSON();
  expect(treeProfile).toMatchSnapshot();

  const treeEmailVeri = renderer.create(<EmailVeri />).toJSON();
  expect(treeEmailVeri).toMatchSnapshot();

  const treeVeri = renderer.create(<VeriScreen />).toJSON();
  expect(treeVeri).toMatchSnapshot();

  const treeVeri = renderer.create(<VeriScreen />).toJSON();
  expect(treeVeri).toMatchSnapshot();
});