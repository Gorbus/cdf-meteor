import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { createContainer } from 'meteor/react-meteor-data';

import { Projects } from './../../api/projects';

import ProjectItem from './ProjectItem'

export const ProjectsList = (props) => {

	const renderProjects = () => {
		return props.projects.map((project) => {
				return <ProjectItem key={project._id} project={project} />
		})
	}

	return (
			<div className="projects">
				<h1 className="projects__title">My projects</h1>
				<div className="projects__list">
					{ renderProjects() }
				</div>
			</div>
	)
}

export default createContainer(({}) => {
	Meteor.subscribe('my-projects');

	return {
		projects: Projects.find({}, {
			sort: {
				updatedAt: -1
			},
		}).fetch(),
	}	
}, ProjectsList)
