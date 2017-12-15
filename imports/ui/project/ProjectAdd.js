import "react-dates/initialize";
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';

export class ProjectAdd extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			title: '',
			type: '',
			country: '',
			pk_start: '',
			pk_end: '',
			length: '',
			date_start: moment(),
			date_end: moment(),
			duration: '',
			calendarFocused: null
		}
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.handlePkStartChange = this.handlePkStartChange.bind(this);
		this.handlePkEndChange = this.handlePkEndChange.bind(this);
		this.onDatesChange = this.onDatesChange.bind(this);
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

	handleCountryChange(e) {
		const country = e.target.value;
		this.setState(() => ({ country }));
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
		this.props.call('projects.insert', this.state.title, this.state.type, this.state.country, parseInt(this.state.pk_start), parseInt(this.state.pk_end), parseInt(this.state.length), this.state.date_start.valueOf(), this.state.date_end.valueOf(), parseInt(this.state.duration));
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
			<div className="project__add">
				<h1 className='project__add-title'>Create a new project</h1>
				<div className="project__add-one-entry"><div className='project__add-entry-title'>Title:</div><input onChange={this.handleTitleChange} value={this.state.title} placeholder="Title" type="text"/></div>
				<div className="project__add-one-entry"><div className='project__add-entry-title'>Type:</div><input onChange={this.handleTypeChange} value={this.state.type} placeholder="Type" type="text"/></div>
				<div className="project__add-one-entry"><div className='project__add-entry-title'>Country:</div><input onChange={this.handleCountryChange} value={this.state.country} placeholder="Country" type="text"/></div>
				<div className="project__add-one-entry"><div className='project__add-entry-title'>Starting pK:</div><input onChange={this.handlePkStartChange} value={this.state.pk_start} placeholder="Starting pK" type="text"/></div>
				<div className="project__add-one-entry"><div className='project__add-entry-title'>Ending pK:</div><input onChange={this.handlePkEndChange} value={this.state.pk_end} placeholder="Ending pK" type="text"/></div>
				<div className="project__add-one-entry"><div className='project__add-entry-title'>Length:</div><input disabled value={this.state.length} placeholder="Length" type="text"/></div>
				<div className="project__add-one-entry project__add-date"><DateRangePicker
				  startDate={this.state.date_start} // momentPropTypes.momentObj or null,
				  endDate={this.state.date_end} // momentPropTypes.momentObj or null,
				  onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
				  focusedInput={this.state.calendarFocused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
				  onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
				  isOutsideRange={() => false}
				/></div>
				<div className="project__add-one-entry"><div className='project__add-entry-title'>Duration:</div><input disabled value={this.state.duration / 1000 / 24 / 60 / 60} placeholder="Duration" type="text"/></div>
				<button className='admin__button' onClick={this.onSubmit}>Create Project</button>
			</div>
			)
	}
};

ProjectAdd.PropTypes = {
	call: PropTypes.func.isRequired
};

export default withTracker(() => {
	return {
		call: Meteor.call
	}
})(ProjectAdd)