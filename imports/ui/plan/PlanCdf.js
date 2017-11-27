import React from 'react';
import {Raphael, Utils, Element, Paper,Set,Circle,Ellipse,Image,Rect,Text,Path,Line} from 'react-raphael';
import moment from 'moment';

import TaskDetail from './TaskDetail';

export default class PlanCdf extends React.Component {
	constructor(props) {
		super(props);
		if (props.project) {
			const paperWidth = screen.width - 320;
			const paperHeight = 600;
			const paperMarginX = 70;
			const paperMarginY = 20;
			const paperScaleWidth = (paperWidth - paperMarginX) / props.project.length;
			const paperScaleHeight = (paperHeight - paperMarginY) / (props.project.duration / 1000 / 60 / 60 / 24);
			const taskDetail = null;
			this.state = {
				paperWidth, paperHeight, paperMarginX, paperMarginY, paperScaleWidth, paperScaleHeight, taskDetail,
				scaleX : [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000],
				scaleY: [1, 7, 14, 30, 61, 91, 122, 183, 274, 365]
			}
		}
		this.drawTasks = this.drawTasks.bind(this);
		this.closest = this.closest.bind(this);
	}

	closest(num, array){
		let curr = array[0];
		let diff = Math.abs(num - curr);
		for (let i = 0; i < array.length; i++){
			let val = array[i];
			let newdiff = Math.abs(num - val);
			if (newdiff < diff){
				diff = newdiff;
				curr = val;
			}
		}
		return curr;
	}

	drawScale() {
		const scaleHeight = 'M' + this.state.paperMarginX + ',' + (this.state.paperHeight - this.state.paperMarginY) + 'L' + this.state.paperWidth + ',' + (this.state.paperHeight - this.state.paperMarginY) + 'L' + (this.state.paperWidth - this.state.paperMarginX  / 4) + ',' + (this.state.paperHeight - this.state.paperMarginY - this.state.paperMarginY / 4) + 'M' + this.state.paperWidth + ',' + (this.state.paperHeight - this.state.paperMarginY) + 'L' + (this.state.paperWidth - this.state.paperMarginX / 4) + ',' + (this.state.paperHeight - this.state.paperMarginY * 3 / 4);
		const scaleWidth = 'M' + this.state.paperMarginX + ',' + (this.state.paperHeight - this.state.paperMarginY) + 'L' + this.state.paperMarginX + ',0L' + (this.state.paperMarginX - this.state.paperMarginY / 2) + ',' + this.state.paperMarginY / 2 + 'M' + this.state.paperMarginX + ',0L' + (this.state.paperMarginX + (this.state.paperMarginY / 2)) + ',' + this.state.paperMarginY / 2;
		let scaleEchelonX = this.closest(this.props.project.length / 10, this.state.scaleX);
		let nrOfEchelonX = Math.ceil(this.props.project.length / scaleEchelonX);
		let startEchelonX = Math.ceil(this.props.project.pk_start / scaleEchelonX);
		if (startEchelonX === 0){
			startEchelonX++;
		}
		if (parseInt((startEchelonX * scaleEchelonX)) === parseInt(this.props.project.pk_start)){
			startEchelonX++;
		}
		let fullScaleX = [];
		fullScaleX.push(<Text key="echX_start_text" x={this.state.paperMarginX} y={this.state.paperHeight - this.state.paperMarginY / 4} text={this.props.project.pk_start + 'm'} attr={{"stroke" : "#565656"}} />);
		for (let j = startEchelonX; j < (startEchelonX + nrOfEchelonX); j++){
			let echX = j * scaleEchelonX;
			if((echX > this.props.project.pk_start * 1.02) && (echX < this.props.project.pk_end * (nrOfEchelonX - 0) / nrOfEchelonX)){
				let echX_draw = 'M' + (this.state.paperMarginX + (echX - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMarginY * 3 / 4) + 'L' + (this.state.paperMarginX + (echX - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMarginY * 5 / 4);
				fullScaleX.push(<Path key={`scaleX${j}draw`} d={echX_draw} attr={{"stroke" : "#565656"}} />);
				let echX_line = 'M' + (this.state.paperMarginX + (echX - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMarginY) + 'L' + (this.state.paperMarginX + (echX - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + '0';
				fullScaleX.push(<Path key={`scaleX${j}line`} d={echX_line} attr={{"stroke" : "#ADADAD", "stroke-dasharray" : "."}} />);
				fullScaleX.push(<Text x={(this.state.paperMarginX + (echX - this.props.project.pk_start) * this.state.paperScaleWidth)} y={(this.state.paperHeight - this.state.paperMarginY / 4)} key={`scaleX${j}text`} text={echX + 'm'} attr={{"stroke" : "#565656"}} />);
			}
		}
		let date_start = this.props.project.date_start / 1000 / 60 / 60 / 24;
		let scaleEchelonY = this.closest(this.props.project.duration / 1000 / 60 / 60 / 24 / 10, this.state.scaleY);
		let nrOfEchelonY = Math.ceil(this.props.project.duration / 1000 / 60 / 60 / 24 / scaleEchelonY);
		let startEchelonY = Math.ceil(this.props.project.date_start / 1000 / 60 / 60 / 24 / scaleEchelonY);
		if(startEchelonY === 0){
			startEchelonY++;
		}
		if (parseInt((startEchelonY * scaleEchelonY)) == parseInt(this.props.project.date_start)){
			startEchelonY++;
		}
		let fullScaleY = [];
		fullScaleY.push(<Text key="echY_start_text" x={2} y={(this.state.paperHeight - this.state.paperMarginY)} text={moment(this.props.project.date_start).format('DD/MM/YYYY')} attr={{"stroke" : "#565656", "text-anchor":"start"}}/>)
		for (let k = 1; k <= nrOfEchelonY; k++){
			let echY = k * scaleEchelonY;
			let yCoord = this.state.paperHeight - this.state.paperMarginY - echY * this.state.paperScaleHeight;
			if ((echY < (this.props.project.duration * (nrOfEchelonY - 0.5) / nrOfEchelonY))){
				let echY_draw = 'M' + (this.state.paperMarginX * 9 / 10) + ',' + yCoord + 'L' + (this.state.paperMarginX * 11 / 10) + ',' + yCoord;
				fullScaleY.push(<Path key={`scaleY${k}draw`} d={echY_draw} attr={{"stroke" : "#565656"}}/>)
				let echY_line = 'M' + this.state.paperMarginX + ',' + yCoord + 'L' + this.state.paperWidth + ',' + yCoord;
				fullScaleY.push(<Path key={`scaleY${k}line`} d={echY_line} attr={{"stroke" : "#ADADAD", "stroke-dasharray" : "--."}}/>)
				fullScaleY.push(<Text x={2} y={yCoord} key={`scaleX${k}text`} text={moment(echY * 24 * 60 * 60 * 1000 + this.props.project.date_start).format('DD/MM/YYYY')} attr={{"stroke" : "#565656", "text-anchor":"start"}} />);
			}
		}
		return (
			<Set>
				<Path key="scaleWidth" d={scaleWidth} attr={{"stroke":"black"}} />
				<Path key="scaleHeight" d={scaleHeight} attr={{"stroke":"black"}} />
				{fullScaleX}
				{fullScaleY}
			</Set>

		)
	}

	onmouseover(task){
		this.setState(() => ({taskDetail : task}));
		this.props.highlight(task);
	}

	onmouseout() {
		this.setState(() => ({taskDetail : null}));
		this.props.lowlight();
	}

	drawTasks() {
		let tasksToDraw = this.props.tasks.map((task) => {
			const startDate = task.dep_date_start ? (task.dep_date_start - this.props.project.date_start) / 1000 / 60 / 60 / 24 : (task.date_start - this.props.project.date_start) / 1000 / 60 / 60 / 24;
			const endDate = task.dep_date_end ? (task.dep_date_end - this.props.project.date_start) / 1000 / 60 / 60 / 24 : (task.date_end - this.props.project.date_start) / 1000 / 60 / 60 / 24;
			let coords = null;
			if (!task.inverted) {
				coords ="M" + (this.state.paperMarginX + (task.pk_start - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMarginY - startDate * this.state.paperScaleHeight) + 'L' + (this.state.paperMarginX + (task.pk_end - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMarginY - endDate * this.state.paperScaleHeight);
			} else {
				coords = "M" + (this.state.paperMarginX + (task.pk_start - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMarginY - endDate * this.state.paperScaleHeight) + 'L' + (this.state.paperMarginX + (task.pk_end - this.props.project.pk_start) * this.state.paperScaleWidth) + ',' + (this.state.paperHeight - this.state.paperMarginY - startDate * this.state.paperScaleHeight);
			}
			var self = this;

			let attr = {
				"stroke": task.color,
				"stroke-width" : "3"
			}
			if (this.props.highlightIds.indexOf(task._id) > -1){
				attr["stroke-width"] = 5;
			};
			return <Path mouseover={function() { return self.onmouseover(task) }} mouseout={function() { return self.onmouseout(this) }} key={task._id} d={coords} attr={attr} />
		})
		return tasksToDraw;
	}

	render() {
		return(
			<div className="plancdf">
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
		this.attr({'stroke-width':'5'})
	}

	render() {
		return <Path mouseover={this.onmouseover} d={this.props.d} attr={this.props.attr} />
	}
}
