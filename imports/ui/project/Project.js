import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Projects } from './../../api/projects';
import { Tasks } from './../../api/tasks';

import TaskAdd from './../task/TaskAdd';
import TaskItem from './../task/TaskItem';
import TaskEdit from './../task/TaskEdit';


import ProjectHeader from './ProjectHeader'; 

import PlanCdf from './../plan/PlanCdf';

export class Project extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			tasksOrder : [],
			highlightIds : [],
			addTaskOpen : false,
			editTaskOpen: null
		}
		this.renderTasks = this.renderTasks.bind(this);
		this.updateAllDependencies = this.updateAllDependencies.bind(this);
		this.updateAllPredsAfterRemovingATask = this.updateAllPredsAfterRemovingATask.bind(this);
		this.updateAllDependenciesAfterRemovingATask = this.updateAllDependenciesAfterRemovingATask.bind(this);
		this.getCalculationOrder = this.getCalculationOrder.bind(this);
		this.updateDepDates = this.updateDepDates.bind(this);
		this.updateAfterChange = this.updateAfterChange.bind(this);
		this.removeRefFromTaskRef = this.removeRefFromTaskRef.bind(this);
		this.highlight = this.highlight.bind(this);
		this.lowlight = this.lowlight.bind(this);
		this.triggerEditMode = this.triggerEditMode.bind(this);
		this.triggerAddMode = this.triggerAddMode.bind(this);
	}

	triggerEditMode(task){
		this.setState(() => ({
			addTaskOpen : false,
			editTaskOpen : task
		}))
	}

	triggerAddMode(){
		let addTaskOpen = !this.state.addTaskOpen;
		this.setState(() => ({
			addTaskOpen,
			editTaskOpen : null
		}))
	}

	removeRefFromTaskRef(refId){
		let tasksRefs = this.state.tasksRefs.filter((ref) => {
			return ref.taskId != refId
		})
		this.setState(() => ({ tasksRefs }));
	}

	highlight(task){
		let highlightIds = this.state.highlightIds;
		highlightIds.push(task._id);
		this.setState(() => ({ highlightIds }));
	}

	lowlight(){
		this.setState(() => ({ highlightIds : [] }));
	}

	updateAfterChange() {
		this.getCalculationOrder(this.updateDepDates);
	}

	updateDepDates(){
		let tasks = this.props.tasks;
		tasksToUpdate = []


		for (let i = 0; i < this.state.tasksOrder.length; i++){
			let task = tasks.one((onetask) => onetask._id === this.state.tasksOrder[i]);
			if(!task.dependencies || (task.dependencies.length === 0)){
				task.dep_date_start = task.date_start;
				task.dep_date_end = task.date_end;
				task.dep_duration = task.duration;
				tasksToUpdate.push(task);
			} else {
				let new_dep_date_start = task.date_start;
				let new_dep_date_end = task.date_end;
				let new_dep_duration = task.duration;
				let rolling_date_start = new_dep_date_start;
				let rolling_date_end = new_dep_date_end;
				for (let j = 0; j < task.predecessors.length; j++){
					let pred = tasks.one((onetask) => onetask._id === task.predecessors[j].id);
					let delay = task.predecessors[j].delay;
					let type = task.predecessors[j].type
					if (type === 'after') {
						if (pred.dep_date_end && (pred.dep_date_end > new_dep_date_start)){
							new_dep_date_start = pred.dep_date_end + delay;
							new_dep_date_end = new_dep_date_start + new_dep_duration;
						}
					} else if(type === 'asap') {
						if (!((task.pk_end < pred.pk_start) || (task.pk_start > pred.pk_end))) {
							let coefPred = pred.dep_duration / pred.length;
							let coefTask = task.dep_duration / task.length;
							if (!task.inverted) {
								if (!pred.inverted) {
									if (coefPred > coefTask) {
										if( task.pk_end >= pred.pk_end) {
											new_dep_date_start = pred.dep_date_end - (pred.pk_end - task.pk_start) * coefTask + delay;
										} else if (task.pk_end < pred.pk_end){
											new_dep_date_start = pred.dep_date_start + coefPred * (task.pk_end - pred.pk_start) - coefTask * (task.length) + delay;
										}
									} else if (coefPred <= coefTask) {
										if (task.pk_start <= pred.pk_start){
											new_dep_date_start = pred.dep_date_start - coefTask * (pred.pk_start - task.pk_start) + delay;
										} else if (task.pk_start > pred.pk_start) {
											new_dep_date_start = pred.dep_date_start + coefPred * (task.pk_start - pred.pk_start) + delay;
										}

									}
								} else if (pred.inverted){
									if (task.pk_start <= pred.pk_start) {
										new_dep_date_start = pred.dep_date_end - coefTask * (pred.pk_start - task.pk_start) + delay;
									}	else if (task.pk_start > pred.pk_start) {
										new_dep_date_start = pred.dep_date_start + coefPred * (pred.pk_end - task.pk_start) + delay;
									}
								}
							} else if (task.inverted){
								if (!pred.inverted) {
									if (task.pk_end >= pred.pk_end){
										new_dep_date_start = pred.dep_date_end - coefTask * (task.pk_end - pred.pk_end) + delay;
									} else if (task.pk_end < pred.pk_end){
										new_dep_date_start = pred.dep_date_start + coefPred * (task.pk_end - pred.pk_start) + delay;
									}
								} else if (pred.inverted) {
									if (coefPred > coefTask) {
										if (task.pk_start <= pred.pk_start) {
											new_dep_date_start = pred.dep_date_end - coefTask * (task.pk_end - pred.pk_start) + delay;
										}	else if (task.pk_start > pred.pk_start) {
											new_dep_date_start = pred.dep_date_end - coefPred * (task.pk_start - pred.pk_start) + delay;
										}
									} else if (coefPred <= coefTask) {
										if (task.pk_end >= pred.pk_end) {
											new_dep_date_start = pred.dep_date_start - coefTask * (task.pk_end - pred.pk_end) + delay;
										}	else if (task.pk_end < pred.pk_end) {
											new_dep_date_start = pred.dep_date_start + coefPred * (pred.pk_end - task.pk_end) + delay;
										}
									}
								}
							}
							new_dep_date_end = new_dep_date_start + coefTask * task.length;
						}
					}
					if (new_dep_date_start > rolling_date_start){
						rolling_date_start = new_dep_date_start;
						rolling_date_end = new_dep_date_end;
					}
				}
				if ((rolling_date_start != task.dep_date_start) || (rolling_date_end != task.dep_date_end)) {
					task.dep_date_start = rolling_date_start;
					task.dep_date_end = rolling_date_end;
					task.dep_duration = new_dep_duration;
					tasksToUpdate.push(task);
				}
			}
		}
		for (let k = 0; k < tasksToUpdate.length; k++){
			let task = tasksToUpdate[k];
			this.props.call('tasks.update', task._id, {dep_date_start : task.dep_date_start, dep_date_end: task.dep_date_end, dep_duration: task.dep_duration})
		}
	}

	getCalculationOrder(callback) {
		let tasksOrder = []
		for (let i = 0; i < this.props.tasks.length; i++){
			const task = this.props.tasks[i]; 
			if (task.dependencies.length === 0){
				tasksOrder.push(task._id)
			}
		}
		while (tasksOrder.length < this.props.tasks.length){
			for (let i = 0; i < this.props.tasks.length; i++){
				const task = this.props.tasks[i]; 
				if (tasksOrder.indexOf(task._id) === -1){
					let count = 0;
					if (task.dependencies.length > 0){
						for (let j = 0; j < task.dependencies.length; j++){
							let depId = task.dependencies[j];
							if (tasksOrder.indexOf(depId) > -1){
								count = count + 1;
							}
						}
						if (count === task.dependencies.length){
							tasksOrder.push(task._id)
						}
					}
				}
			}
		}
		this.setState(() => ({tasksOrder}))
		if(callback){
			callback()
		}
	}


	updateAllDependencies(taskId) {
		for (let i = 0; i < this.props.tasks.length; i++){
			let task = this.props.tasks[i];
			let newDependencies = [];
			const loopPreds = (task) => {
				if(task.predecessors.length > 0){
					for (let j = 0; j < task.predecessors.length ; j++){
						let predId = task.predecessors[j].id;
						newDependencies.push(predId)
						let pred = this.props.tasks.one((onetask) => onetask._id === predId);
						if (pred && pred.predecessors && pred.predecessors.length > 0){
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
				if (uniqueDependencies && uniqueDependencies.length > 0){
					this.props.call('tasks.update', task._id, {dependencies: uniqueDependencies});
				}
			}
		}
		let self = this;
		setTimeout(() => self.updateAfterChange(), 1);
	}

	updateAllPredsAfterRemovingATask(taskId) {
		for (let i = 0; i < this.props.tasks.length; i++){
			let task = this.props.tasks[i];
			if (task.predecessors.length > 0){
				let newPreds = task.predecessors.filter((predId) => predId.id != taskId)
				this.props.call('tasks.update', task._id, { predecessors : newPreds})
			}
		}
		this.updateAllDependenciesAfterRemovingATask(taskId)
	}

	updateAllDependenciesAfterRemovingATask(taskId) {
		for (let i = 0; i < this.props.tasks.length; i++){
			let task = this.props.tasks[i];
			let newDependencies = [];
			const loopPreds = (task) => {
				if(task && task.predecessors.length > 0){
					for (let j = 0; j < task.predecessors.length ; j++){
						let predId = task.predecessors[j].id;
						if (predId != taskId){
							newDependencies.push(predId)
							let pred = this.props.tasks.one((onetask) => onetask._id === predId);
							if (pred && pred.predecessors.length > 0){
								loopPreds(pred);
							}
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
		let self = this;
		setTimeout(() => self.updateAfterChange(), 1);
	}




	renderTasks() {
		return this.props.tasks.map((task) => {
			let bold;
			this.state.highlightIds.indexOf(task._id) > -1 ? bold = true : bold = false;
			return <TaskItem key={task._id} bold={bold} task={task} tasks={this.props.tasks} highlight={this.highlight} lowlight={this.lowlight} triggerEditMode={this.triggerEditMode} updateAllPredsAfterRemovingATask={this.updateAllPredsAfterRemovingATask} />
		})
	}

	render(){
		console.log(this.props.tasks);
		if(this.props.loaded){
			return (
				<div className='project'>
					<ProjectHeader project={this.props.project} triggerAddMode={this.triggerAddMode} />
					<div className="project-content">
						<PlanCdf tasks={this.props.tasks} project={this.props.project} removeRefFromTaskRef={this.removeRefFromTaskRef} highlight={this.highlight} lowlight={this.lowlight} highlightIds={this.state.highlightIds} />
						{this.state.addTaskOpen ? <TaskAdd projectId={this.props.project._id} tasks={this.props.tasks} updateAfterChange={this.updateAfterChange} triggerAddMode={this.triggerAddMode} /> : undefined}
						<div className='project__tasks-list'>
							<div className="task__title">
								<div className="task__data task__data__title data__title">Title</div>
								<div className="task__data task__data__title data__type">Type</div>	
								<div className="task__data task__data__title data__pk_start">Starting pK</div>	
								<div className="task__data task__data__title data__pk_end">Ending pK</div>	
								<div className="task__data task__data__title data__length">Length</div>	
								<div className="task__data task__data__title data__date_start">Starting Date</div>	
								<div className="task__data task__data__title data__date_end">Ending Date</div>
								<div className="task__data task__data__title data__dep_date_start">DEP Starting Date</div>	
								<div className="task__data task__data__title data__dep_date_end">DEP Ending Date</div>
								<div className="task__data task__data__title data__duration">Duration</div>	
								<div className="task__data task__data__title data__quantity">Quantity</div>	
								<div className="task__data task__data__title data__quantity_unit">Quantity Unit</div>	
								<div className="task__data task__data__title data__rate">Rate</div>
								<div className="task__data task__data__title data__inverted">Inverted</div>
								<div className="task__data task__data__title task__data__title data__color">Color</div>
								<div className="task__data task__data__title data__edit">Edit</div>
								<div className="task__data task__data__title data__delete">Delete</div>
							</div>
							{this.props.tasks.length > 0 ? this.renderTasks() : <p>No task for this project</p>}
							{ this.state.editTaskOpen ? <TaskEdit task={this.state.editTaskOpen} closeEditMode={() => this.setState(() => ({editTaskOpen : null}))} tasks={this.props.tasks} updateAllDependencies={this.updateAllDependencies} /> : undefined }
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="loading">Loading...</div>
			)
		}
	}

}



export default withTracker((props) => {
	const subProject = Meteor.subscribe('project', props.match.params.id);
	const subTasks = Meteor.subscribe('project_tasks', props.match.params.id)

	return {
		loaded: subProject.ready() && subTasks.ready(),
		project: Projects.findOne(props.match.params.id),
		tasks: Tasks.find({}).fetch(),
		call: Meteor.call,
	}	
})(Project)
