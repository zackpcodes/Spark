import React from 'react';
import Conversation from '../Screens/Conversation';
import ConvosFeed from '../Screens/ConvoFeed';
import EmailVeri from '../Screens/EmailVeri';
import ProfileSetup from '../Screens/ProfileSetup';
import VeriScreen from '../Screens/VeriScreen';
import ProfileUpdate from '../Screens/ProfileUpdate';
import Settings from '../Screens/Settings';
import renderer from 'react-test-renderer';


it('Email renders correctly', () => {
	const tree = renderer.create(<EmailVeri />).toJSON();
	expect(tree).toMatchSnapshot();
});

it('Verification Code renders correctly', () => {
	const tree = renderer.create(<VeriScreen />).toJSON();
	expect(tree).toMatchSnapshot();
});

it('Profile Setup renders correctly', () => {
	const tree = renderer.create(<ProfileSetup />).toJSON();
	expect(tree).toMatchSnapshot();
});

it('Profile Update renders correctly', () => {
	const tree = renderer.create(<ProfileUpdate />).toJSON();
	expect(tree).toMatchSnapshot();
});

it('Settings renders correctly', () => {
	const tree = renderer.create(<Settings />).toJSON();
	expect(tree).toMatchSnapshot();
});





