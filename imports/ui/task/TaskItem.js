import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import TaskEdit from './TaskEdit';

export default class TaskItem extends React.Component{
	constructor(props) {
		super(props)
		this.state= {
			deleteMode: false
		}
		this.changeDeleteMode = this.changeDeleteMode.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
	}

	confirmDelete() {
		Meteor.call('tasks.remove', this.props.task._id, (err, res) => this.props.updateAllPredsAfterRemovingATask(res));
	}

	changeDeleteMode(){
		const deleteMode = !this.state.deleteMode;
		this.setState(() => ({deleteMode}));
	}

	onMouseOver() {
		this.props.highlight(this.props.task)
	}

	onMouseOut() {
		this.props.lowlight();
	}

	render() {
		return(
				<div className={this.props.bold ? "task bold" : "task"} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
					<div className="task__data data__title">{this.props.task.title}</div>
					<div className="task__data data__type">{this.props.task.type}</div>	
					<div className="task__data data__pk_start">{this.props.task.pk_start}</div>	
					<div className="task__data data__pk_end">{this.props.task.pk_end}</div>	
					<div className="task__data data__length">{this.props.task.length}</div>	
					<div className="task__data data__date_start">{moment(this.props.task.date_start).format('DD/MM/YYYY')}</div>	
					<div className="task__data data__date_end">{moment(this.props.task.date_end).format('DD/MM/YYYY')}</div>	
					<div className="task__data data__dep_date_start">{moment(this.props.task.dep_date_start).format('DD/MM/YYYY')}</div>	
					<div className="task__data data__dep_date_end">{moment(this.props.task.dep_date_end).format('DD/MM/YYYY')}</div>	
					<div className="task__data data__duration">{this.props.task.dep_duration / 1000 / 60 / 60 / 24}</div>	
					<div className="task__data data__quantity">{this.props.task.quantity}</div>	
					<div className="task__data data__quantity_unit">{this.props.task.quantity_unit}</div>	
					<div className="task__data data__rate">{this.props.task.rate}</div>
					<div className="task__data data__inverted">{this.props.task.inverted.toString()}</div>
					<div className="task__data data__color" style={{backgroundColor: this.props.task.color}}>{this.props.task.color}</div>
					<div className="task__data data__edit" onClick={() => this.props.triggerEditMode(this.props.task)}>Edit Task</div>
					{ this.state.deleteMode ? <div><div onClick={this.confirmDelete.bind(this)}>Confirm Delete</div><div onClick={this.changeDeleteMode}>Cancel Delete</div></div> : <div className="task__data data__delete" onClick={this.changeDeleteMode.bind(this)}>Delete Task</div>}
				</div>
			)
	}
}