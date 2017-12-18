import "react-dates/initialize";
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';

export class ProjectEdit extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			title: props.project ? props.project.title : '',
			type: props.project ? props.project.type : '',
			country: props.project ? props.project.country : '',
			pk_start: props.project ? props.project.pk_start : '',
			pk_end: props.project ? props.project.pk_end : '',
			length: props.project ? props.project.length : '',
			date_start: props.project ? moment(props.project.date_start) : moment(),
			date_end: props.project ? moment(props.project.date_end) : moment(),
			duration: props.project ? props.project.duration : '',
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
		this.props.call('projects.update', this.props.project._id, {
			title: this.state.title,
			type: this.state.type,
			country: this.state.country,
			pk_start: parseInt(this.state.pk_start),
			pk_end: parseInt(this.state.pk_end),
			length: parseInt(this.state.length),
			date_start: this.state.date_start.valueOf(),
			date_end: this.state.date_end.valueOf(),
			duration: parseInt(this.state.duration)
		}, () => {
			this.props.closeEditMode();
		})
	}

	render() {
		return(
			<div className="project__add">
				Title: <input onChange={this.handleTitleChange} value={this.state.title} placeholder="Title" type="text"/>
				Type: <input onChange={this.handleTypeChange} value={this.state.type} placeholder="Type" type="text"/>
				Country: <input onChange={this.handleCountryChange} value={this.state.country} placeholder="Country" type="text"/>
				Starting pK: <input onChange={this.handlePkStartChange} value={this.state.pk_start} placeholder="Starting pK" type="text"/>
				Ending pK: <input onChange={this.handlePkEndChange} value={this.state.pk_end} placeholder="Ending pK" type="text"/>
				Length: <input disabled value={this.state.length} placeholder="Length" type="text"/>
				<DateRangePicker
				  startDate={this.state.date_start} // momentPropTypes.momentObj or null,
				  endDate={this.state.date_end} // momentPropTypes.momentObj or null,
				  onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
				  focusedInput={this.state.calendarFocused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
				  onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
				  isOutsideRange={() => false}
				/>
				Duration: <input disabled value={this.state.duration / 1000 / 60 / 60 / 24} placeholder="Duration" type="text"/>
				<button className='admin__button' onClick={this.onSubmit}>Edit Project</button>
				<button className='admin__button' onClick={() => this.props.closeEditMode()}>Cancel</button>

			</div>
			)
	}
};

ProjectEdit.PropTypes = {
	call: PropTypes.func.isRequired
};

export default withTracker(() => {
	return {
		call: Meteor.call
	}
})(ProjectEdit)