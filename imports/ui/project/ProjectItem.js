import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import ProjectEdit from './ProjectEdit';

export default class ProjectItem extends React.Component {
	constructor(props){
		super(props);
		this.state= {
			editMode: false,
			deleteMode: false
		}
	}

	confirmDelete() {
		Meteor.call('projects.remove', this.props.project._id)
	}

	changeDeleteMode(){
		const deleteMode = !this.state.deleteMode;
		this.setState(() => ({deleteMode}));
	}

	render() {
		return(
			<div className="projects__project">
					<Link to={`/project/${this.props.project._id}`}className="project__data">Title: {this.props.project.title}</Link>
					<div className="project__data">Type: {this.props.project.type}</div>	
					<div className="project__data">Country: {this.props.project.country}</div>	
					<div className="project__data">Starting pK: {this.props.project.pk_start}</div>	
					<div className="project__data">Ending pK: {this.props.project.pk_end}</div>	
					<div className="project__data">Length: {this.props.project.length}</div>	
					<div className="project__data">Starting Date: {moment(this.props.project.date_start).format('DD/MM/YYYY')}</div>	
					<div className="project__data">Ending Date: {moment(this.props.project.date_end).format('DD/MM/YYYY')}</div>	
					<div className="project__data">Duration: {this.props.project.duration}</div>
					<button onClick={() => this.setState(() => ({editMode: true}))}>Edit Project</button>
					{ this.state.deleteMode ? <div><button onClick={this.confirmDelete.bind(this)}>Confirm Delete</button><button onClick={this.changeDeleteMode.bind(this)}>Cancel Delete</button></div> : <button onClick={this.changeDeleteMode.bind(this)}>Delete Project</button>}
					{ this.state.editMode ? <ProjectEdit project={this.props.project} /> : undefined }

			</div>
			)
	}
}