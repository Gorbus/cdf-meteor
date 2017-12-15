import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom'

export const SideBar = (props) => {
	console.log(props.user)
	return (
		<div className='sidebar'>
			<div className="button-logout" onClick={() => Accounts.logout() }>Logout</div>
			<h1 className="sidebar__title">Planning CDF</h1>
			<div className="sidebar__connected-as">Connected as:</div>
			{ props.loading || !props.user ? undefined : <div className="sidebar__email">{props.user.emails[0].address}</div>}
			{props.user ? <div className="back-to-projects"><Link to="/projects">Back to your projects</Link></div> : undefined	}
		</div>
		)
}



export default withTracker(() => {
    const loading = !Meteor.user();
    const user = Meteor.user();
    return { loading, user };
})(SideBar);