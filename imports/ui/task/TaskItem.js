import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import TaskEdit from './TaskEdit';

export default class TaskItem extends React.Component{
	constructor(props) {
		super(props)
		this.state= {
			editMode: false,
			deleteMode: false
		}
	}

	confirmDelete() {
		Meteor.call('tasks.remove', this.props.task._id)
	}

	changeDeleteMode(){
		const deleteMode = !this.state.deleteMode;
		this.setState(() => ({deleteMode}));
	}


	render() {
		return(
				<div className="task">
					<div className="task__data">Title: {this.props.task.title}</div>
					<div className="task__data">Type: {this.props.task.type}</div>	
					<div className="task__data">Starting pK: {this.props.task.pk_start}</div>	
					<div className="task__data">Ending pK: {this.props.task.pk_end}</div>	
					<div className="task__data">Length: {this.props.task.length}</div>	
					<div className="task__data">Starting Date: {this.props.task.date_start}</div>	
					<div className="task__data">Ending Date: {this.props.task.date_end}</div>	
					<div className="task__data">Duration: {this.props.task.duration}</div>	
					<div className="task__data">Quantity: {this.props.task.quantity}</div>	
					<div className="task__data">Quantity Unit: {this.props.task.quantity_unit}</div>	
					<div className="task__data">Rate: {this.props.task.rate}</div>
					<button onClick={() => this.setState(() => ({editMode: true}))}>Edit Task</button>
					{ this.state.deleteMode ? <div><button onClick={this.confirmDelete.bind(this)}>Confirm Delete</button><button onClick={this.changeDeleteMode.bind(this)}>Cancel Delete</button></div> : <button onClick={this.changeDeleteMode.bind(this)}>Delete Task</button>}
					{ this.state.editMode ? <TaskEdit task={this.props.task} /> : undefined }
				</div>
			)
	}
}