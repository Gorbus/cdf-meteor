import "react-dates/initialize";
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { CompactPicker } from 'react-color';

import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';

export class TaskAdd extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			title: '',
			type: '',
			pk_start: '',
			pk_end: '',
			length: '',
			date_start: moment(),
			date_end: moment(),
			duration: '',
			quantity: '',
			quantity_unit: '',
			rate: '',
			inverted: false,
			color: 'black',
			calendarFocused: null,
			possiblePredecessors: this.props.tasks ? this.props.tasks : [],
			predecessors: [],
			dependencies: []
		}
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handlePkStartChange = this.handlePkStartChange.bind(this);
		this.handlePkEndChange = this.handlePkEndChange.bind(this);
		this.onDatesChange = this.onDatesChange.bind(this);
		this.handleQuantityChange = this.handleQuantityChange.bind(this);
		this.handleQuantityUnitChange = this.handleQuantityUnitChange.bind(this);
		this.handleRateChange = this.handleRateChange.bind(this);
		this.handleInvertedChange = this.handleInvertedChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.renderPossiblePreds = this.renderPossiblePreds.bind(this);
		this.addPredecessor = this.addPredecessor.bind(this);
		this.getPossiblePredecessors = this.getPossiblePredecessors.bind(this);
		this.updateDependenciesWhenAddingPred = this.updateDependenciesWhenAddingPred.bind(this);
		this.updateDependenciesWhenRemovingPred = this.updateDependenciesWhenRemovingPred.bind(this);
		this.renderPreds = this.renderPreds.bind(this);
		this.handleChangeColor = this.handleChangeColor.bind(this);
	}

	componentWillReceiveProps(){
		this.getPossiblePredecessors();
	}

	handleTitleChange(e) {
		const title = e.target.value;
		this.setState(() => ({	title }));
	}

	handleTypeChange(e) {
		const type = e.target.value;
		this.setState(() => ({	type	}));
	}

	handlePkStartChange(e) {
		const pk_start = e.target.value;
		const length = e.target.value && this.state.pk_end ? (parseInt(this.state.pk_end) - parseInt(e.target.value)).toString() : '';
		this.setState(() => ({ pk_start, length }));
	}

	handlePkEndChange(e) {
		const pk_end = e.target.value;
		const length = this.state.pk_start && e.target.value ? (parseInt(e.target.value) - parseInt(this.state.pk_start)).toString() : '';
		this.setState(() => ({ pk_end, length }));
	}

	handleQuantityChange(e) {
		const quantity = e.target.value;
		this.setState(() => ({	quantity	}));
	}

	handleQuantityUnitChange(e) {
		const quantity_unit = e.target.value;
		this.setState(() => ({	quantity_unit	}));
	}

	handleRateChange(e) {
		const rate = e.target.value;
		this.setState(() => ({	rate	}));
	}

	handleInvertedChange(e) {
		const inverted = e.target.checked;
		this.setState(() => ({	inverted	}));
	}

	onDatesChange({ startDate, endDate }) {
		const duration = startDate && endDate ? endDate.diff(startDate, 'ms') : ''
		this.setState(() => ({
			date_start: startDate,
			date_end: endDate,
			duration
			})
		)
	}

	onFocusChange(focusedInput) {
		this.setState(() => ({
			calendarFocused: focusedInput
		})
		)
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.call('tasks.insert',
			this.props.projectId,
			this.state.title,
			this.state.type,
			parseInt(this.state.pk_start),
			parseInt(this.state.pk_end),
			parseInt(this.state.length),
			this.state.date_start.valueOf(),
			this.state.date_end.valueOf(),
			parseInt(this.state.duration),
			null,
			null,
			null,
			parseInt(this.state.quantity),
			this.state.quantity_unit,
			parseInt(this.state.rate),
			this.state.inverted,
			this.state.color,
			null,
			this.state.predecessors,
			this.state.dependencies
			, () => {
				this.props.updateAfterChange();
				this.setState({
					title: '',
					type: '',
					country: '',
					length: '',
					pk_start: '',
					pk_end: '',
					date_start: moment(),
					date_end: moment(),
					duration: '',
					inverted: false,
					color: "black",
					predecessors: [],
					dependencies: []
				})
			});
	}


	updateDependenciesWhenAddingPred(taskId){
		let dependencies = this.state.dependencies;
		let task = this.props.tasks.one((task) => task._id === taskId)
		if(!dependencies.one((onetaskId) => onetaskId === taskId)){
			dependencies.push(taskId);
			if (task.dependencies){
				for (let i = 0 ; i < task.dependencies.length ; i++){
					if(!dependencies.one((onetaskId) => onetaskId == task.dependencies[i]))
						dependencies.push(task.dependencies[i])
				}
			}
		}
		this.setState(() => ({ dependencies }), () => {
			this.getPossiblePredecessors();	
		})
	}

	getPossiblePredecessors(){
		let possiblePredecessorsTasks = this.props.tasks.filter((task) => {
			if (this.state.predecessors.one((pred) => pred.id === task._id)){
				return false;
			}
			return true; 
		})
		let possiblePredecessors = possiblePredecessorsTasks.map((task) => {
			return task;
		})
		this.setState(() => ({ possiblePredecessors }))
	}

	addPredecessor(id, type) {
		let predecessors = this.state.predecessors;
		predecessors.push({id, type, delay : 0});
		this.setState(() => ({ predecessors }));
		this.updateDependenciesWhenAddingPred(id);
	}

	updateDependenciesWhenRemovingPred(){
		let dependencies = [];
		for (let i = 0; i < this.state.predecessors.length; i++){
			let predId = this.state.predecessors[i].id;
			dependencies.push(predId);
			let pred = this.props.tasks.one((task) => task._id === predId);
			if (pred.dependencies){
				for (let j = 0; j < pred.dependencies.length; j++){
					let depId = pred.dependencies[j];
					if(!dependencies.one((onetaskId) => onetaskId === depId)) {
						dependencies.push(depId)
					}
				}
			}
		}
		this.setState(() => ({ dependencies }), () => {
			this.getPossiblePredecessors();
		})
	}

	removePredecessor(taskId){
		let predecessors = this.state.predecessors.filter((pred) => {
			if (pred.id === taskId) {
				return false;
			} else {
				return true;
			}
		})
		this.setState(() => ({ predecessors }), () => {
			this.updateDependenciesWhenRemovingPred();
		});
	}

	renderPossiblePreds() {
		return this.state.possiblePredecessors.map((task) => {
			return <div key={task._id}>{task.title} <div onClick={() => this.addPredecessor(task._id, 'asap')}>ASAP</div><div onClick={() => this.addPredecessor(task._id, 'after')}>AFTER</div></div> 			
		});
	}

	renderPreds() {
		let preds = this.state.predecessors.map((pred) => {
			return this.props.tasks.filter((onetask) => onetask._id === pred.id)[0];
		})
		return preds.map((task) => {
			return <div onClick={() => this.removePredecessor(task._id)} key={task._id}>{task.title}</div> 
		})
	}

	handleChangeColor(color) {
	  this.setState(() => ({ color: color.hex }));
	};


	// FUNCTION TO REMOVE PREDS AND REUPDATE DEPENDENCIES

	render() {
		return(
			<div className="task__add">
				<h1>ADD A TASK TO PROJECT</h1>
				<div className="task__add-item"><h2>Title:</h2> <input onChange={this.handleTitleChange} value={this.state.title} placeholder="Title" type="text"/></div>
				<div className="task__add-item"><h2>Type:</h2> <input onChange={this.handleTypeChange} value={this.state.type} placeholder="Type" type="text"/></div>
				<div className="task__add-item"><h2>Starting pK:</h2> <input onChange={this.handlePkStartChange} value={this.state.pk_start} placeholder="Starting pK" type="text"/></div>
				<div className="task__add-item"><h2>Ending pK:</h2> <input onChange={this.handlePkEndChange} value={this.state.pk_end} placeholder="Ending pK" type="text"/></div>
				<div className="task__add-item"><h2>Length:</h2> <input disabled value={this.state.length} placeholder="Length" type="text"/></div>
				<DateRangePicker
				  startDate={this.state.date_start} // momentPropTypes.momentObj or null,
				  endDate={this.state.date_end} // momentPropTypes.momentObj or null,
				  onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
				  focusedInput={this.state.calendarFocused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
				  onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
				  isOutsideRange={() => false}
				/>
				<div className="task__add-item"><h2>Duration:</h2> <input disabled value={this.state.duration} placeholder="Duration" type="text"/></div>
				<div className="task__add-item"><h2>Quantity:</h2> <input onChange={this.handleQuantityChange} value={this.state.quantity} placeholder="Quantity" type="text"/></div>
				<div className="task__add-item"><h2>Quantity Unit:</h2> <input onChange={this.handleQuantityUnitChange} value={this.state.quantity_unit} placeholder="Quantity Unit" type="text"/></div>
				<div className="task__add-item"><h2>Rate:</h2> <input onChange={this.handleRateChange} value={this.state.rate} placeholder="Rate" type="text"/></div>
				<div className="task__add-item"><h2>Inverted:</h2> <input type="checkbox" onChange={this.handleInvertedChange} /></div>
	      <CompactPicker
	        color={ this.state.color }
	        onChangeComplete={ this.handleChangeColor }
	      />
				<div className="task__add-item"><h3>Possible Predecessors</h3><div className="task__add-possiblePreds">{ this.renderPossiblePreds() }</div></div>

				<div className="task__add-item"><h3>Predecessors</h3><div className="task__add-preds"> { this.renderPreds() }</div></div>

				<button className='admin__button' onClick={this.onSubmit}>Add a Task</button>
			</div>
			)
	}
};

TaskAdd.PropTypes = {
	call: PropTypes.func.isRequired
};

export default createContainer(() => {
	return {
		call: Meteor.call
	}
}, TaskAdd)