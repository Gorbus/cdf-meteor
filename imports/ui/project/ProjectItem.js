import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export default class ProjectItem extends React.Component {
	constructor(props){
		super(props);
		this.state= {
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
			<div className="project__item">
					<Link to={`/project/${this.props.project._id}`}className="project__data project-title">{this.props.project.title}</Link>
					<div className="project__data project-type">{this.props.project.type}</div>	
					<div className="project__data project-country">{this.props.project.country}</div>	
					<div className="project__data project-pk_start">{this.props.project.pk_start}</div>	
					<div className="project__data project-pk_end">{this.props.project.pk_end}</div>	
					<div className="project__data project-length">{this.props.project.length}</div>	
					<div className="project__data project-date_start">{moment(this.props.project.date_start).format('DD/MM/YYYY')}</div>	
					<div className="project__data project-date_end">{moment(this.props.project.date_end).format('DD/MM/YYYY')}</div>	
					<div className="project__data project-duration">{this.props.project.duration / 1000 / 60 / 60 / 24}</div>
					<div className="project__data project-edit"><button onClick={() => this.props.triggerProjectEditMode(this.props.project)}>Edit Project</button></div>
					{ this.state.deleteMode ? <div className="project__data project-delete project-delete-mode"><button onClick={this.changeDeleteMode.bind(this)}>Cancel</button><button onClick={this.confirmDelete.bind(this)}>Confirm Delete</button></div> : <div className="project__data project-delete"><button onClick={this.changeDeleteMode.bind(this)}>Delete Project</button></div>}
					{ this.state.editMode ? <ProjectEdit project={this.props.project} /> : undefined }

			</div>
			)
	}
}

