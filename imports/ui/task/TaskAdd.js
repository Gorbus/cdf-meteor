import "react-dates/initialize";
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { CompactPicker } from 'react-color';

import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';

import PossiblePreds from './PossiblePreds';
import PredItem from './PredItem';
import Error from './../Error';


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
			dependencies: [],
			errors: [],
			transitionOut: null
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
		this.removePredecessor = this.removePredecessor.bind(this);
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
		let errors = this.state.errors;
		let error1 = 'Starting pK must be smaller than ending pK';
		if (pk_start => this.state.pk_end){
			if (errors.indexOf(error1) === -1){
				errors.push(error1)				
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error1 != error;
			})
		}
		if (errors.length === 0){
			this.setState(() => ({pk_start, length, transitionOut : 'transitionOut'}),
				() => setTimeout(() => this.setState(() => ({ errors })), 500)
			 )
		} else {

			this.setState(() => ({ pk_start, length, errors, transitionOut: null }))
		}

	}

	handlePkEndChange(e) {
		const pk_end = e.target.value;
		const length = this.state.pk_start && e.target.value ? (parseInt(e.target.value) - parseInt(this.state.pk_start)).toString() : '';
		let errors = this.state.errors;
		let error1 = 'Starting pK must be smaller than ending pK';
		if (pk_end <= this.state.pk_start){
			if (errors.indexOf(error1) === -1){
				errors.push(error1)				
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error1 != error;
			})
		}
		if (errors.length === 0){
			this.setState(() => ({pk_end, length, transitionOut : 'transitionOut'}),
				() => setTimeout(() => this.setState(() => ({ errors })), 500)
			 )
		} else {
			this.setState(() => ({ pk_end, length, errors, transitionOut: null  }))
		}
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
		if (this.state.errors.length > 0){
			return
		}
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
				}, () => {
					this.props.triggerAddMode();
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

	addPredecessor(id, type, delay) {
		let predecessors = this.state.predecessors;
		predecessors.push({id, type, delay});
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
		console.log(this.state);
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
			return <PossiblePreds key={task._id} task={task} addPredecessor={this.addPredecessor} />		
		});
	}

	renderPreds() {
		let preds = this.state.predecessors.map((pred) => {
			return [this.props.tasks.filter((onetask) => onetask._id === pred.id)[0], pred.type];
		})
		return preds.map((task) => {
			return <PredItem removePredecessor={this.removePredecessor} key={task[0]._id} task={task[0]} type={task[1]} /> 
		})
	}

	handleChangeColor(color) {
	  this.setState(() => ({ color: color.hex }));
	};


	// FUNCTION TO REMOVE PREDS AND REUPDATE DEPENDENCIES

	render() {
		console.log(this.state.errors);
		return(
			<div className="task__add">
				{this.state.errors.length > 0 ? <Error errors={this.state.errors} transitionOut={this.state.transitionOut} /> : undefined}
				<h1 className='task__add-main-title'>ADD A TASK</h1>
				<div className="task__add-item"><div className='add--task-title'>Title:</div> <input className='task__add-input' onChange={this.handleTitleChange} value={this.state.title} placeholder="Title" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Type:</div> <input className='task__add-input' onChange={this.handleTypeChange} value={this.state.type} placeholder="Type" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Starting pK:</div> <input className='task__add-input' onChange={this.handlePkStartChange} value={this.state.pk_start} placeholder="Starting pK" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Ending pK:</div> <input className='task__add-input' onChange={this.handlePkEndChange} value={this.state.pk_end} placeholder="Ending pK" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Length:</div> <input className='task__add-input' disabled value={this.state.length} placeholder="Length" type="text"/></div>
				<div className="divDateRangePicker">
					<span>Starting Date</span>
					<DateRangePicker
					  startDate={this.state.date_start} // momentPropTypes.momentObj or null,
					  endDate={this.state.date_end} // momentPropTypes.momentObj or null,
					  onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
					  focusedInput={this.state.calendarFocused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
					  onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
					  isOutsideRange={() => false}
					/>
					<span>Finishing Date</span>
				</div>
				<div className="task__add-item"><div className='add--task-title'>Duration:</div> <input className='task__add-input' disabled value={this.state.duration} placeholder="Duration" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Quantity:</div> <input className='task__add-input' onChange={this.handleQuantityChange} value={this.state.quantity} placeholder="Quantity" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Quantity Unit:</div> <input className='task__add-input' onChange={this.handleQuantityUnitChange} value={this.state.quantity_unit} placeholder="Quantity Unit" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Rate:</div> <input className='task__add-input' onChange={this.handleRateChange} value={this.state.rate} placeholder="Rate" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Inverted:</div> <input className='task__add-input' type="checkbox" onChange={this.handleInvertedChange} /></div>
	     	<div className="task__colorpicker">
		     	<CompactPicker
		        color={ this.state.color }
		        onChangeComplete={ this.handleChangeColor }
		      />
	     	</div>
				<div className="task__poss-preds">
					<h3 className="task__poss-preds__title">Possible Predecessors</h3>
					<div className="task__add-possiblePreds">{ this.renderPossiblePreds() }</div>
				</div>

				<div className="task__poss-preds">
					<h3 className="task__poss-preds__title">Predecessors</h3>
					<div className="task__add-preds"> { this.renderPreds() }</div>
				</div>
				<div className="add__buttons">
					<button className='admin__button' onClick={this.onSubmit}>Add a Task</button>
					<button className='admin__button admin__button-close' onClick={this.props.triggerAddMode}>Close</button>
				</div>
			</div>
			)
	}
};

TaskAdd.PropTypes = {
	call: PropTypes.func.isRequired
};

export default withTracker(() => {
	return {
		call: Meteor.call
	}
})(TaskAdd)