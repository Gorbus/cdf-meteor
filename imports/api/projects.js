import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
 
export const Projects = new Mongo.Collection('projects');


if (Meteor.isServer) {
	Meteor.publish('my-projects', function() {
		if (!this.userId){
			return false;			
		}
		return Projects.find({userId: this.userId});
	});

	Meteor.publish('project', function(projectId) {
		if (!this.userId){
			return false;			
		}
		return Projects.find({userId: this.userId, _id: projectId});
	});

}


Meteor.methods({
	'projects.insert'(title, type, country, pk_start, pk_end, length, date_start, date_end, duration) {
		let userId = this.userId;
		let username = Meteor.user().username;

		new SimpleSchema({
			title: {
				type: String,
				required: true,
				max: 280
			},
			type: {
				type: String,
				max: 280
			},
			country: {
				type: String,
				max: 120
			},
			pk_start: {
				type: Number,
				required: true
			},
			pk_end: {
				type: Number,
				required: true
			},
			length: {
				type: Number,
				required: true
			},
			date_start: {
				type: Number,
				required: true
			},
			date_end: {
				type: Number,
				required: true
			},
			duration: {
				type: Number,
				required: true
			}
		}).validate({ title, type, country, pk_start, pk_end, length, date_start, date_end, duration });

		return Projects.insert({
			title,
			type,
			country,
			pk_start,
			pk_end,
			length,
			date_start,
			date_end,
			duration,
			userId,
			username,
			createdAt: moment().valueOf(),
			updatedAt: moment().valueOf()
			})
	},
	// UPDATES A ENVOYER DE LA FORME : {title, pk_start...}

	'projects.update'(_id, updates) {
		const project = Projects.findOne({_id}) 
		if (project.userId !== this.userId) {
			throw new Meteor.Error('not-authorized')
		};

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			},
			title: {
				type: String,
				optional: true,
				max: 280
			},
			type: {
				type: String,
				optional: true,
				max: 280
			},
			country: {
				type: String,
				optional: true,
				max: 120
			},
			pk_start: {
				type: Number,
				optional: true
			},
			pk_end: {
				type: Number,
				optional: true
			},
			length: {
				type: Number,
				optional: true
			},
			date_start: {
				type: Number,
				optional: true
			},
			date_end: {
				type: Number,
				optional: true
			},
			duration: {
				type: Number,
				optional: true
			}
		}).validate({_id, ...updates });

		Projects.update({
			_id,
			userId: this.userId
		}, {
			$set: {
				updatedAt: moment().valueOf(),
				...updates,
			}
		})
	},

	'projects.remove'(_id) {
		const project = Projects.findOne({_id}) 
		if (project.userId !== this.userId) {
			throw new Meteor.Error('not-authorized')
		};

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			}
		}).validate({ _id });

		Projects.remove({
			_id,
			userId: this.userId
		})
	}
})