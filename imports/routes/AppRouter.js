import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Footer from './../ui/Footer';
import SideBar from './../ui/SideBar';
import Index from './../ui/Index';
import Login from './../ui/Login';
import Project from './../ui/project/Project';
import Signup from './../ui/Signup';


const AppRouter = () => (
	<BrowserRouter>
		<div className="wholesite">
			<SideBar />
			<Switch>
				<Route path="/" component={Index} exact={true} />
				<Route path="/project/:id" component={Project} />
				<Route path="/login" component={Login} />
				<Route path="/signup" component={Signup} />
			</Switch>
		</div>
	</BrowserRouter>
);

export default AppRouter;