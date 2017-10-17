import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

export const Header = (props) => {
	return (
		<div className='header'>
			<h3>Header</h3>
			{ }
			<button className="button button--link-text" onClick={() => Accounts.logout() }>Logout</button>
			{ props.loading ? undefined : props.user._id}
		</div>
		)
}



export default createContainer(() => {
    const loading = !Meteor.user();
    const user = Meteor.user();
    return { loading, user };
}, Header);