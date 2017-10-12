import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Projects } from './../../api/projects';
import { Tasks } from './../../api/tasks';

import TaskAdd from './../task/TaskAdd';
import TaskItem from './../task/TaskItem'; 



export class Project extends React.Component {
	constructor(props){
		super(props)
		this.renderProject = this.renderProject.bind(this);
		this.renderTasks = this.renderTasks.bind(this);
	}

	renderTasks() {
		return this.props.tasks.map((task) => {
			return <TaskItem key={task._id} task={task} />
		})
	}

	renderProject() {
		return (
				<div className="project">
					{this.props.project.title}
					{this.props.tasks.length > 0 ? this.renderTasks() : <p>No task for this project</p>}
					<TaskAdd projectId={this.props.project._id} />
				</div>
			)
	}
	render(){
		return (
				<div>
					{this.props.loaded ? this.renderProject() : <div className="loading">Loading...</div>}
				</div>
			)
	}

}



export default createContainer((props) => {
	const sub = Meteor.subscribe('project', props.match.params.id);
	const subTask = Meteor.subscribe('project_tasks', props.match.params.id)

	return {
		loaded: sub.ready() && subTask.ready(),
		project: Projects.findOne(props.match.params.id),
		tasks: Tasks.find({}).fetch()
	}	
}, Project)