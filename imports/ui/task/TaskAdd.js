import "react-dates/initialize";
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { CompactPicker } from 'react-color';

import 'react-dates/lib/css/_datepicker.css';

import { SingleDatePicker } from 'react-dates';

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
			date_end: moment().add(1, "days"),
			duration: 24 * 60 * 60 * 1000,
			quantity: '',
			quantity_unit: '',
			rate: '',
			inverted: false,
			color: 'black',
			focusedDateStart: false,
			focusedDateEnd: false,
			durationDisabled: "",
			dateEndDisabled: false,
			possiblePredecessors: this.props.tasks ? this.props.tasks : [],
			predecessors: [],
			dependencies: [],
			errors: [],
			transitionOut: null,
			generalError : undefined,
			rateDisabled: "disabled",
			rateType: "duration"
		}
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handlePkStartChange = this.handlePkStartChange.bind(this);
		this.handlePkEndChange = this.handlePkEndChange.bind(this);
		this.onDateStartChange = this.onDateStartChange.bind(this);
		this.onDateEndChange = this.onDateEndChange.bind(this);
		this.handleQuantityChange = this.handleQuantityChange.bind(this);
		this.handleQuantityUnitChange = this.handleQuantityUnitChange.bind(this);
		this.handleRateChange = this.handleRateChange.bind(this);
		this.handleInvertedChange = this.handleInvertedChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.renderPossiblePreds = this.renderPossiblePreds.bind(this);
		this.addPredecessor = this.addPredecessor.bind(this);
		this.getPossiblePredecessors = this.getPossiblePredecessors.bind(this);
		this.updateDependenciesWhenAddingPred = this.updateDependenciesWhenAddingPred.bind(this);
		this.updateDependenciesWhenRemovingPred = this.updateDependenciesWhenRemovingPred.bind(this);
		this.renderPreds = this.renderPreds.bind(this);
		this.handleChangeColor = this.handleChangeColor.bind(this);
		this.removePredecessor = this.removePredecessor.bind(this);
		this.defineRateAndQuantity = this.defineRateAndQuantity.bind(this);
		this.defineDurationAndQuantity = this.defineDurationAndQuantity.bind(this);
		this.onDurationChange = this.onDurationChange.bind(this);
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
		const pk_start = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
		const length = e.target.value && this.state.pk_end ? (parseInt(this.state.pk_end) - parseInt(e.target.value)).toString() : '';
		let errors = this.state.errors;
		let error1 = 'Starting pK must be smaller than ending pK';
		let error2 = `Starting and ending pK must be with project boundary (${this.props.project.pk_start} - ${this.props.project.pk_end})`;
		
		if (pk_start => this.state.pk_end){
			if (errors.indexOf(error1) === -1){
				errors.push(error1)				
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error1 != error;
			})
		}
		if (pk_start < this.props.project.pk_start || pk_start > this.props.project.pk_end){
			if (errors.indexOf(error2) === -1){
				errors.push(error2)
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error2 != error;
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
		const pk_end = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
		const length = this.state.pk_start && e.target.value ? (parseInt(e.target.value) - parseInt(this.state.pk_start)).toString() : '';
		let errors = this.state.errors;
		let error1 = 'Starting pK must be smaller than ending pK';
		let error2 = `Starting and ending pK must be with project boundary (${this.props.project.pk_start} - ${this.props.project.pk_end})`;
		if (pk_end <= this.state.pk_start){
			if (errors.indexOf(error1) === -1){
				errors.push(error1)				
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error1 != error;
			})
		}
		if (pk_end < this.props.project.pk_start || pk_end > this.props.project.pk_end){
			if (errors.indexOf(error2) === -1){
				errors.push(error2)
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error2 != error;
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
		const quantity = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
		let duration = this.state.duration;
		let dateEnd = this.state.date_end;
		let rate = this.state.rate;
		if(this.state.rateType === "rate"){
			if (quantity && this.state.rate){
				duration = (quantity / this.state.rate)* 24 * 60 * 60 * 1000;
				if(this.state.date_start){
					dateEnd = moment(this.state.date_start + duration);
				}

			}
		} else {
			if (quantity && duration){
				rate = quantity / (duration / 1000 / 24 / 60 / 60)
			}
		}
		this.setState(() => ({	quantity, date_end: dateEnd, duration, rate	}));
	}

	handleQuantityUnitChange(e) {
		const quantity_unit = e.target.value;
		this.setState(() => ({	quantity_unit	}));
	}

	handleRateChange(e) {
		const rate = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0
		let duration = this.state.duration;
		let dateEnd = this.state.date_end;
		if(rate && this.state.quantity){
			duration = (this.state.quantity / rate) * 1000 * 60 * 60 * 24;
			if(this.state.date_start){
				dateEnd = moment(this.state.date_start + duration);
			}
		}
		this.setState(() => ({	rate, duration, date_end : dateEnd	}));
	}

	handleInvertedChange(e) {
		const inverted = e.target.checked;
		this.setState(() => ({	inverted	}));
	}

	onDateStartChange(startDate) {
		let duration = this.state.duration;
		if (startDate && this.state.date_end){
			duration = (this.state.date_end.valueOf() - startDate.valueOf());
		}
		let rate = this.state.rate;
		if (duration && this.state.quantity){
			rate = this.state.quantity / (duration / 1000 / 60 / 60 / 24)
		}
		this.setState(() => ({
			date_start: startDate,
			duration,
			rate
			})
		)
	}

	onDateEndChange(endDate) {
		let duration = this.state.duration;
		if (endDate && this.state.date_start){
			duration = (endDate.valueOf() - this.state.date_start.valueOf());
		}
		let rate = this.state.rate;
		if (duration && this.state.quantity){
			rate = this.state.quantity / (duration / 1000 / 60 / 60 / 24)
		}
		this.setState(() => ({
			date_end: endDate,
			duration,
			rate
			})
		)
	}

	onDurationChange(e) {
		let endDate = this.state.date_end;
		let duration = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) * 1000 * 60 * 60 * 24 || 0;
		if (duration && this.state.date_start){
			endDate = moment(this.state.date_start.valueOf() + duration);
		}
		let rate = this.state.rate;
		if (duration && this.state.quantity){
			rate = this.state.quantity / (duration / 1000 / 60 / 60 / 24)
		}
		this.setState(() => ({
			date_end: endDate,
			duration,
			rate
			})
		)
	}

	onSubmit(e) {
		let errors = this.state.errors;
		let error3 = "Title can not be empty";
		let error4 = "pK Start can not be empty";
		let error5 = "pK end can not be empty";
		let error6 = "Starting Date and Finishing Date have to be selected"
		let error7 = "Quantity can not be empty or null";
		let error8 = "Quantity Unit can not be empty";
		let error9 = "Rate Can not be empty or null"
		if (this.state.title.length === 0){
			if (errors.indexOf(error3) === -1){
				errors.push(error3);
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error3 != error;
			})
		};
		if (this.state.pk_start.length === 0){
			if (errors.indexOf(error4) === -1){
				errors.push(error4);
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error4 != error;
			})
		};
		if (this.state.pk_end.length === 0){
			if (errors.indexOf(error5) === -1){
				errors.push(error5);
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error5 != error;
			})
		};
		if (this.state.title.date_start === 0 || this.state.title.date_end === 0 ){
			if (errors.indexOf(error6) === -1){
				errors.push(error6);
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error6 != error;
			})
		};
		if (this.state.quantity.length === 0 || this.state.quantity === 0){
			if (errors.indexOf(error7) === -1){
				errors.push(error7);
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error7 != error;
			})
		};
		if (this.state.quantity_unit.length === 0){
			if (errors.indexOf(error8) === -1){
				errors.push(error8);
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error8 != error;
			})
		};
		if (this.state.rate.length === 0 || this.state.rate === 0){
			if (errors.indexOf(error9) === -1){
				errors.push(error9);
			}
		} else {
			errors = this.state.errors.filter((error) => {
				return error9 != error;
			})
		};
		this.setState(() => ({ errors }), () => {
			if (this.state.errors.length > 0){
				this.setState(() => ({ generalError : 'Please fix all errors and resubmit'}))
				return;
			} else {
				this.setState(() => ({ generalError : undefined }))
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
						}
					)
				});
			}
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

	defineRateAndQuantity(){
		this.setState(() => ({ rateDisabled : "", dateEndDisabled: true, durationDisabled: "disabled", rateType: "rate" }));
 	}

	defineDurationAndQuantity(){
		this.setState(() => ({ rateDisabled : "disabled", dateEndDisabled: false, durationDisabled: "", rateType: "duration" }));
	}

	// FUNCTION TO REMOVE PREDS AND REUPDATE DEPENDENCIES

	render() {
		console.log(this.state);
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
					<SingleDatePicker
					  date={this.state.date_start} // momentPropTypes.momentObj or null,
					  onDateChange={this.onDateStartChange} // PropTypes.func.isRequired,
					  focused={this.state.focusedDateStart} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
					  onFocusChange={({ focused }) => {
					  	this.setState(() => ({ focusedDateStart: focused }))
						}
					  } // PropTypes.func.isRequired,
					  isOutsideRange={() => false}
					/>
					<SingleDatePicker
					  date={this.state.date_end} // momentPropTypes.momentObj or null,
					  onDateChange={this.onDateEndChange} // PropTypes.func.isRequired,
					  focused={this.state.focusedDateEnd} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
					  onFocusChange={({ focused }) => {
					  	this.setState(() => ({ focusedDateEnd: focused }))
							}
					  } // PropTypes.func.isRequired,
					  isOutsideRange={() => false}
					  disabled={this.state.dateEndDisabled}
					/>
					<span>Finishing Date</span>
				</div>
				<div className="choose-rate-type">
					<div className="task__add-button-rate" onClick={this.defineRateAndQuantity}>Fix Rate & Quantity</div>
					<div className="task__add-button-rate" onClick={this.defineDurationAndQuantity}>Fix Duration & Quantity</div>
				</div>
				<div className="task__add-item"><div className='add--task-title'>Duration:</div> <input className='task__add-input' onChange={this.onDurationChange} disabled={this.state.durationDisabled} value={this.state.duration / 1000 / 60 / 60 / 24} placeholder="Duration" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Quantity:</div> <input className='task__add-input' onChange={this.handleQuantityChange} value={this.state.quantity} placeholder="Quantity" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Quantity Unit:</div> <input className='task__add-input' onChange={this.handleQuantityUnitChange} value={this.state.quantity_unit} placeholder="Quantity Unit" type="text"/></div>
				<div className="task__add-item"><div className='add--task-title'>Rate:</div> <input disabled={this.state.rateDisabled} className='task__add-input' onChange={this.handleRateChange} value={this.state.rate} placeholder="Rate" type="text"/></div>
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
				<div>{this.state.generalError}</div>
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