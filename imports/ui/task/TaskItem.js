import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TaskEdit from './TaskEdit';

export default class TaskItem extends React.Component{
	constructor(props) {
		super(props)
		this.state= {
			editMode: false,
			deleteMode: false
		}
		this.changeDeleteMode = this.changeDeleteMode.bind(this);
		this.changeEditMode = this.changeEditMode.bind(this);
	}

	confirmDelete() {
		Meteor.call('tasks.remove', this.props.task._id, (err, res) => this.props.updateAllPredsAfterRemovingATask(res));
	}

	changeEditMode() {
		const editMode = !this.state.editMode;
		this.setState(() => ({ editMode }));
	}

	changeDeleteMode(){
		const deleteMode = !this.state.deleteMode;
		this.setState(() => ({deleteMode}));
	}


	render() {
		return(
				<div className="task">
					<div className="task__data">{this.props.task.title}</div>
					<div className="task__data">{this.props.task.type}</div>	
					<div className="task__data">{this.props.task.pk_start}</div>	
					<div className="task__data">{this.props.task.pk_end}</div>	
					<div className="task__data">{this.props.task.length}</div>	
					<div className="task__data">{moment(this.props.task.date_start).format('DD/MM/YYYY')}</div>	
					<div className="task__data">{moment(this.props.task.date_end).format('DD/MM/YYYY')}</div>	
					<div className="task__data">{this.props.task.duration / 1000 / 60 / 60 / 24}</div>	
					<div className="task__data">{this.props.task.quantity}</div>	
					<div className="task__data">{this.props.task.quantity_unit}</div>	
					<div className="task__data">{this.props.task.rate}</div>
					<div className="task__data">{this.props.task.inverted.toString()}</div>
					<button onClick={() => this.setState(() => ({editMode: true}))}>Edit Task</button>
					{ this.state.deleteMode ? <div><button onClick={this.confirmDelete.bind(this)}>Confirm Delete</button><button onClick={this.changeDeleteMode}>Cancel Delete</button></div> : <button onClick={this.changeDeleteMode.bind(this)}>Delete Task</button>}
					{ this.state.editMode ? <TaskEdit task={this.props.task} tasks={this.props.tasks} changeEditMode={this.changeEditMode} updateAllDependencies={this.props.updateAllDependencies.bind(this)} /> : undefined }
				</div>
			)
	}
}