import "react-dates/initialize";
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';

export class TaskAdd extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			title: props.task ? props.task.title : '',
			type: props.task ? props.task.type : '',
			pk_start: props.task ? props.task.pk_start : '',
			pk_end: props.task ? props.task.pk_end : '',
			length: props.task ? props.task.length : '',
			date_start: props.task ? moment.unix(props.task.date_start) : moment(),
			date_end: props.task ? moment.unix(props.task.date_end) : moment(),
			duration: props.task ? props.task.duration : '',
			quantity: props.task ? props.task.quantity : '',
			quantity_unit: props.task ? props.task.quantity_unit : '',
			rate: props.task ? props.task.rate : '',
			inverted: props.task ? props.task.inverted : false,
			calendarFocused: null
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
		this.props.call('tasks.update',this.props.task._id, {
			title: this.state.title,
			type: this.state.type,
			pk_start: parseInt(this.state.pk_start),
			pk_end: parseInt(this.state.pk_end),
			length: parseInt(this.state.length),
			date_start: this.state.date_start.unix(),
			date_end: this.state.date_end.unix(),
			duration : parseInt(this.state.duration),
			quantity: parseInt(this.state.quantity),
			quantity_unit: this.state.quantity_unit,
			rate: parseInt(this.state.rate),
			inverted: this.state.inverted,
			});
		// this.setState({
		// 	title: '',
		// 	type: '',
		// 	country: '',
		// 	length: '',
		// 	pk_start: '',
		// 	pk_end: '',
		// 	date_start: '',
		// 	date_end: '',
		// 	duration: '',
		// })
	}

	render() {
		return(
			<div className="task__add">
				<h1>ADD A TASK TO PROJECT</h1>
				<div className="task__add-item">Title: <input onChange={this.handleTitleChange} value={this.state.title} placeholder="Title" type="text"/></div>
				<div className="task__add-item">Type: <input onChange={this.handleTypeChange} value={this.state.type} placeholder="Type" type="text"/></div>
				<div className="task__add-item">Starting pK: <input onChange={this.handlePkStartChange} value={this.state.pk_start} placeholder="Starting pK" type="text"/></div>
				<div className="task__add-item">Ending pK: <input onChange={this.handlePkEndChange} value={this.state.pk_end} placeholder="Ending pK" type="text"/></div>
				<div className="task__add-item">Length: <input disabled value={this.state.length} placeholder="Length" type="text"/></div>
				<DateRangePicker
				  startDate={this.state.date_start} // momentPropTypes.momentObj or null,
				  endDate={this.state.date_end} // momentPropTypes.momentObj or null,
				  onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
				  focusedInput={this.state.calendarFocused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
				  onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
				  isOutsideRange={() => false}
				/>
				<div className="task__add-item">Duration: <input disabled value={this.state.duration} placeholder="Duration" type="text"/></div>
				<div className="task__add-item">Quantity: <input onChange={this.handleQuantityChange} value={this.state.quantity} placeholder="Duration" type="text"/></div>
				<div className="task__add-item">Quantity Unit: <input onChange={this.handleQuantityUnitChange} value={this.state.quantity_unit} placeholder="Quantity Unit" type="text"/></div>
				<div className="task__add-item">Rate: <input onChange={this.handleRateChange} value={this.state.rate} placeholder="Rate" type="text"/></div>

				<button className='admin__button' onClick={this.onSubmit}>Edit Task</button>
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