import React from 'react';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

export default class Signup extends React.Component {
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

		if (password.length < 6){
			return this.setState({
				error: 'Password must be more than 5 characters long'
			})
		}

		Accounts.createUser({email, password}, (err) => {
			if (err) {
				this.setState({
					error: err.reason
				})
			} else {
				this.setState({
					error: ""
				})
			}
		});

	}

	render() {
		return (
			<div className='signup'>
				<div className='container'>
					<div className='signup__main'>
						<h1 className='signup__title'>Créer son compte</h1>
						{this.state.error ? <p>{this.state.error}</p> : undefined}
						<form onSubmit={this.onSubmit.bind(this)} className='signup__form' noValidate>
							<input type="email" ref="email" name="email" placeholder="Your email" />
							<input type="password" ref="password" name="password" placeholder="Password" />
							<button className="signup__button">Créer son compte</button>
						</form>
						<Link to="/login">Vous avez déjà un compte ?</Link>
					</div>
				</div>
			</div>	

		);
	}
}
