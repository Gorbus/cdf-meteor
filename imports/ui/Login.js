import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
	}

	onSubmit(e) {
		e.preventDefault();

		let email = this.refs.email.value.trim();
		let password = this.refs.password.value.trim();

		Meteor.loginWithPassword({email}, password, (err) => {
			if (err) {
				this.setState({
					error: err.reason
				})
			} else {
				this.setState({
					error: ""
				})
			}
		})
	}



	render() {
		return (
			<div className="login">
				<div className="container">
					<div className="login__main">
						<h1 className="login__title">Login</h1>
						{this.state.error ? <p>{this.state.error}</p> : undefined}
						<form onSubmit={this.onSubmit.bind(this)} className='login__form' noValidate>
							<input type="email" ref="email" name="email" placeholder="Your email" />
							<input type="password" ref="password" name="password" placeholder="Password" />
							<button className='login__button'>Login</button>
						</form>
						<Link to="/signup">Need an account ?</Link>
					</div>
				</div>
			</div>
		);
	}
}
