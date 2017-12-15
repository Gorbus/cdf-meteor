import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import { Projects } from './../../api/projects';

import ProjectItem from './ProjectItem'
import ProjectEdit from './ProjectEdit'


export class ProjectsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editProjectOpen: false,
			editProject: null
		}
		this.triggerProjectEditMode = this.triggerProjectEditMode.bind(this)
		this.renderProjects = this.renderProjects.bind(this);
	}

	triggerProjectEditMode(project) {
		this.setState(() => ({
			editProjectOpen: true,
			editProject: project
		}))
	}

	renderProjects() {
		return this.props.projects.map((project) => {
				return <ProjectItem key={project._id} project={project} triggerProjectEditMode={this.triggerProjectEditMode} />
		})
	}

	render() {
		return (
			<div className="projects__list-main">
				<h1 className="projects__title">My projects</h1>

				<div className="projects__list">
					<div className="projects__list-titles">
						<div className="projects__list-title project-title">Title</div>
						<div className="projects__list-title project-type">Type</div>	
						<div className="projects__list-title project-country">Country</div>	
						<div className="projects__list-title project-pk_start">Starting pK</div>	
						<div className="projects__list-title project-pk_end">Ending pK</div>	
						<div className="projects__list-title project-length">Length</div>	
						<div className="projects__list-title project-date_start">Starting Date</div>	
						<div className="projects__list-title project-date_end">Ending Date</div>	
						<div className="projects__list-title project-duration">Duration</div>
						<div className="projects__list-title project-edit">Edit</div>
						<div className="projects__list-title project-delete">Delete</div>					
					</div>
					{ this.renderProjects() }
				</div>
			{ this.state.editProjectOpen ? <ProjectEdit project={this.state.editProject} closeEditMode={() => this.setState(() => ({editProjectOpen : false}))} /> : undefined }

			</div>
		)
	}	
}

export default withTracker(({}) => {
	Meteor.subscribe('my-projects');

	return {
		projects: Projects.find({}, {
			sort: {
				updatedAt: -1
			},
		}).fetch(),
	}	
})(ProjectsList)
