import React from 'react';


export default class Error extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			transition: ''
		}
	}

	componentDidMount(){
		setTimeout(() => {
				this.setState(() => ({
				transition: 'transition ' 
			}))}, 100)
	}

	renderErrors() {
		return this.props.errors.map((error, index) => {
			return <li key={`error${index}`} className="error__msg">{error}</li>
		})
	}

	render() {
		return (
			<div className={this.props.transitionOut ? this.state.transition + "error " + this.props.transitionOut : this.state.transition + "error"}>
				<div className="error_list">
					<ul>
						{ this.renderErrors() }
					</ul>
				</div>
			</div>
		)
	}
}