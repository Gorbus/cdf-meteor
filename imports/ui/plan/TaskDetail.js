import React from 'react';
import moment from 'moment';

export default class TaskDetail extends React.Component{
	constructor(props){
		super(props)
		this.state= {
			x: 0,
			y :0
		}
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	componentDidMount(){
		document.addEventListener('mousemove', this.onMouseMove);
	}

	componentWillUnmount(){
		document.removeEventListener('mousemove', this.onMouseMove);
	}

	onMouseMove(e){
		this.setState(() => ({
			x: e.clientX,
			y: e.clientY
		}))
	}

	render() {
		return(
			<div className="task__details" style={{top:this.state.y + "px", left:this.state.x + "px"}}>
				<p>Title: {this.props.task.title}</p>
				<p>Type: {this.props.task.type}</p>	
				<p>Starting pK: {this.props.task.pk_start}</p>	
				<p>Ending pK: {this.props.task.pk_end}</p>	
				<p>Length: {this.props.task.length}</p>	
				<p>Starting Date: {moment(this.props.task.date_start).format('DD/MM/YYYY')}</p>	
				<p>Ending Date: {moment(this.props.task.date_end).format('DD/MM/YYYY')}</p>	
				<p>Duration: {this.props.task.duration / 1000 / 60 / 60 / 24}</p>	
				<p>Quantity: {this.props.task.quantity}</p>	
				<p>Quantity Unit: {this.props.task.quantity_unit}</p>	
				<p>Rate: {this.props.task.rate}</p>
			</div>
			)	
	}
}