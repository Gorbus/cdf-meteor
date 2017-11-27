import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { withTracker } from 'meteor/react-meteor-data';

export const SideBar = (props) => {
	return (
		<div className='sidebar'>
			<h3>Header</h3>
			{ }
			<button className="button button--link-text" onClick={() => Accounts.logout() }>Logout</button>
			{ props.loading ? undefined : props.user._id}
		</div>
		)
}



export default withTracker(() => {
    const loading = !Meteor.user();
    const user = Meteor.user();
    return { loading, user };
})(SideBar);