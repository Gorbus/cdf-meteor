import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';

import AppRouter from './../imports/routes/AppRouter'

import './../imports/startup/simple-schema-configuration'

Tracker.autorun(() => {
});

Meteor.startup(() => {
	ReactDOM.render(<AppRouter />, document.getElementById('app'))
})