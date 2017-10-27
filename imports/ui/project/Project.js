import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Projects } from './../../api/projects';
import { Tasks } from './../../api/tasks';

import TaskAdd from './../task/TaskAdd';
import TaskItem from './../task/TaskItem'; 

import PlanCdf from './../plan/PlanCdf';

export class Project extends React.Component {
	constructor(props){
		super(props)
		this.renderProject = this.renderProject.bind(this);
		this.renderTasks = this.renderTasks.bind(this);
		this.updateAllDependencies = this.updateAllDependencies.bind(this);
	}

	updateAllDependencies(taskId) {
		for (let i = 0; i < this.props.tasks.length; i++){
			let task = this.props.tasks[i];
			let newDependencies = [];

			const loopPreds = (task) => {
				if(task.predecessors){
					for (let j = 0; j < task.predecessors.length ; j++){
						let predId = task.predecessors[j];
						newDependencies.push(predId)
						let pred = this.props.tasks.one((onetask) => onetask._id === predId);
						if (pred.predecessors){
							loopPreds(pred);
						}
					}
				}
			}

			if(task.dependencies.one((onetaskId) => onetaskId === taskId)){
				loopPreds(task);
				let uniqueDependencies = newDependencies.filter(function(item, pos) {
			    return newDependencies.indexOf(item) == pos;
				});
				this.props.call('tasks.update', task._id, {dependencies: uniqueDependencies});
			}


		}
	}

	renderTasks() {
		return this.props.tasks.map((task) => {
			return <TaskItem key={task._id} task={task} tasks={this.props.tasks} updateAllDependencies={this.updateAllDependencies} />
		})
	}



	renderProject() {
		console.log(this.props.tasks);
		return (
				<div className="project">
					<PlanCdf tasks={this.props.tasks} project={this.props.project} />
					{this.props.project.title}
					<div className="task">
						<div className="task__data">Title</div>
						<div className="task__data">Type</div>	
						<div className="task__data">Starting pK</div>	
						<div className="task__data">Ending pK</div>	
						<div className="task__data">Length</div>	
						<div className="task__data">Starting Date</div>	
						<div className="task__data">Ending Date</div>	
						<div className="task__data">Duration</div>	
						<div className="task__data">Quantity</div>	
						<div className="task__data">Quantity Unit</div>	
						<div className="task__data">Rate</div>
						<div className="task__data">Inverted</div>
						<div className="task__data">Edit</div>
						<div className="task__data">Delete</div>
				</div>
					{this.props.tasks.length > 0 ? this.renderTasks() : <p>No task for this project</p>}
					<TaskAdd projectId={this.props.project._id} tasks={this.props.tasks} />
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
	const subProject = Meteor.subscribe('project', props.match.params.id);
	const subTasks = Meteor.subscribe('project_tasks', props.match.params.id)

	return {
		loaded: subProject.ready() && subTasks.ready(),
		project: Projects.findOne(props.match.params.id),
		tasks: Tasks.find({}).fetch(),
		call: Meteor.call
	}	
}, Project)
