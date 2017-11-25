import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export default class PossiblePreds extends React.Component{
	constructor(props) {
		super(props)
	}


	render() {
		return(
				<div className="poss-pred">
					<div className="poss-pred__data poss-pred__data__title">{this.props.task.title}</div>
					<div className="poss-pred__data poss-pred__data__type">{this.props.task.type}</div>	
					<div className="poss-pred__data poss-pred__data__pk_start">{this.props.task.pk_start}</div>	
					<div className="poss-pred__data poss-pred__data__pk_end">{this.props.task.pk_end}</div>	
					<div className="poss-pred__data poss-pred__data__dep_date_start">{moment(this.props.task.dep_date_start).format('DD/MM/YYYY')}</div>	
					<div className="poss-pred__data poss-pred__data__dep_date_end">{moment(this.props.task.dep_date_end).format('DD/MM/YYYY')}</div>	
					<div className="poss-pred__data poss-pred__data__inverted">{this.props.task.inverted.toString()}</div>
					<div className="poss-pred__data poss-pred__data__color" style={{backgroundColor: this.props.task.color}}></div>
					<div className="poss-pred__button" onClick={() => this.props.addPredecessor(this.props.task._id, 'asap')}>Asap</div>
					<div className="poss-pred__button" onClick={() => this.props.addPredecessor(this.props.task._id, 'after')}>After</div>
				</div>
			)
	}
}