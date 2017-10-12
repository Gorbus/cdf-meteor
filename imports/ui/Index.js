import React from 'react';
import ProjectAdd from './project/ProjectAdd';
import ProjectsList from './project/ProjectsList';

export default () => {
	return (
		<div>
			<h1>Index</h1>
			<ProjectAdd />
			<ProjectsList />
		</div>
		)
}