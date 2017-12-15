import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import ProjectAdd from './project/ProjectAdd';
import ProjectsList from './project/ProjectsList';

export class Projects extends React.Component {
	render() {
		if (!this.props.user && !this.props.logging){
			return (
				<Redirect to="/" />
				)
		} else {
			return (
				<div className="projects">
					<ProjectsList />
					<ProjectAdd />
				</div>
			)
		}
	}
}

export default withTracker(() => {
	return {
    logging: Meteor.loggingIn(),
    user: Meteor.user()
	}
})(Projects)