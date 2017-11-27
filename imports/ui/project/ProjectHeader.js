import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Session } from 'meteor/session';

export default class ProjectHeader extends React.Component {
	constructor(props){
		super(props);

	}

	render() {
		return (
			<div className="project-header">
				<div className='project-header-content'>
					<div className='project-header__project-title'>{this.props.project.title}</div>
					<div className='project-header__project-pks'>
						<div className='project-header__project_pk_start'>From :{this.props.project.pk_start}</div>
						<div className='project-header__project_pk_end'>To: {this.props.project.pk_end}</div>
					</div>
					<div className='project-header__project-dates'>
						<div className='project-header__project_date_start'>Starting Date: {moment(this.props.project.date_start).format('DD/MM/YYYY')}</div>
						<div className='project-header__project_date_end'>Ending Date: {moment(this.props.project.date_end).format('DD/MM/YYYY')}</div>
					</div>
				</div>
				<div className='project-header__toolbox'>
					<div className='project-header__add-task' onClick={this.props.triggerAddMode}>+ Add a task</div>
				</div>
			</div>
			)
	}
}