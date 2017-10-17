import React from 'react';
import {Raphael,Paper,Set,Circle,Ellipse,Image,Rect,Text,Path,Line} from 'react-raphael';

import TaskDetail from './TaskDetail';

export default class PlanCdf extends React.Component {
	constructor(props) {
		super(props);
		if (props.project) {
			const paperWidth = screen.width - 320;
			const paperHeight = 600;
			const paperMargin = 20;
			const paperScaleWidth = (paperWidth - paperMargin) / props.project.length;
			const paperScaleHeight = (paperHeight - paperMargin) / (props.project.duration / 1000 / 60 / 60 / 24);
			const taskDetail = null;
			this.state = {
				paperWidth, paperHeight, paperMargin, paperScaleWidth, paperScaleHeight, taskDetail
			}
		}
		this.drawTasks = this.drawTasks.bind(this);
	}

	drawScale() {
		const scaleWidth = 'M' + this.state.paperMargin + ',' + (this.state.paperHeight - this.state.paperMargin) + 'L' + this.state.paperMargin + ',0L' + this.state.paperMargin * 3 / 4 + ',' + this.state.paperMargin / 2 + 'M' + this.state.paperMargin + ',0L' + (this.state.paperMargin + (this.state.paperMargin / 4)) + ',' + this.state.paperMargin / 2
		const scaleHeight = 'M' + this.state.paperMargin + ',' + (this.state.paperHeight - this.state.paperMargin) + 'L' + this.state.paperWidth + ',' + (this.state.paperHeight - this.state.paperMargin) + 'L' + (this.state.paperWidth - this.state.paperMargin  / 2) + ',' + (this.state.paperHeight - this.state.paperMargin - this.state.paperMargin / 4) + 'M' + this.state.paperWidth + ',' + (this.state.paperHeight - this.state.paperMargin) + 'L' + (this.state.paperWidth - this.state.paperMargin / 2) + ',' + (this.state.paperHeight - this.state.paperMargin * 3 / 4)
		return (
			<Set>
				<Path key="scaleWidth" d={scaleWidth} attr={{"stroke":"black"}} />
				<Path key="scaleHeight" d={scaleHeight} attr={{"stroke":"black"}} />
			</Set>

		)
	}

	onmouseover(raphael_context, task){
		this.setState(() => ({taskDetail : task}));
		raphael_context.attr({'stroke-width':'5'});
	}

	onmouseout(raphael_context) {
		raphael_context.attr({'stroke-width':'3'});
		this.setState(() => ({taskDetail : null}));
	}

	drawTasks() {
		return this.props.tasks.map((task) => {
			const startDate = task.dep_date_start ? (task.dep_date_start - this.props.project.date_start) / 1000 / 60 / 60 / 24 : (task.date_start - this.props.project.date_start) / 1000 / 60 / 60 / 24;
			const endDate = task.dep_date_end ? (task.dep_date_end - this.props.project.date_start) / 1000 / 60 / 60 / 24 : (task.date_end - this.props.project.date_start) / 1000 / 60 / 60 / 24;
			let coords = null;
			if (!task.inverted) {
				coords ="M" + (this.state.paperMargin + (task.pk_start - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMargin - startDate * this.state.paperScaleHeight) + 'L' + (this.state.paperMargin + (task.pk_end - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMargin - endDate * this.state.paperScaleHeight);
			} else {
				coords = "M" + (this.state.paperMargin + (task.pk_start - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMargin - endDate * this.state.paperScaleHeight) + 'L' + (this.state.paperMargin + (task.pk_end - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMargin - startDate * this.state.paperScaleHeight);
			}
			var self = this;
			return <Path mouseover={function() { return self.onmouseover(this, task) }} mouseout={function() { return self.onmouseout(this) }} key={task._id} d={coords} attr={{"fill":"#444444", "stroke-width" : "3"}} />
		})
	}

	render() {
		return(
			<div>
				<Paper className={"paper"} width={this.state.paperWidth} height={this.state.paperHeight}>
					{ this.drawScale() }
					<Set>
						{ this.drawTasks() }
					</Set>
				</Paper>
				<div>
					{ this.state.taskDetail ? <TaskDetail task={this.state.taskDetail} /> : undefined}
				</div>
			</div>
		)
	}
}


export class PathWrapper extends React.Component {
	constructor(props){
		super(props);
	}

	onmouseover() {
		console.log(this)
		this.attr({'stroke-width':'5'})
	}

	render() {
		return <Path mouseover={this.onmouseover} d={this.props.d} attr={this.props.attr} />
	}
}
