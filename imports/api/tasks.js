import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
 
export const Tasks = new Mongo.Collection('tasks');


if (Meteor.isServer) {
	Meteor.publish('project_tasks', function(projectId) {
		if (!this.userId){
			return false;
		}
		// IF AUTHORIZED TO CHECK THIS PROJECT
		return Tasks.find({projectId});
	});
}


Meteor.methods({
	'tasks.insert'(projectId, title, type, pk_start, pk_end, length, date_start, date_end, duration, dep_date_start, dep_date_end, dep_duration, quantity, quantity_unit, rate, inverted, color, comments, predecessors, dependencies) {
		let userId = this.userId;
		let username = Meteor.user().username;
		new SimpleSchema({
			projectId: {
				type: String,
				required: true
			},
			title: {
				type: String,
				required: true,
				max: 280
			},
			type: {
				type: String,
				max: 280
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
			},
			dep_date_start: {
				type: Number,
				required: false
			},
			dep_date_end: {
				type: Number,
				required: false
			},
			dep_duration: {
				type: Number,
				required: false
			},
			quantity: {
				type: Number,
				required: true
			},
			quantity_unit: {
				type: String,
				required: true
			},
			rate: {
				type: Number,
				required: true
			},
			inverted: {
				type: Boolean,
				required: true
			},
			color: {
				type: String,
				required: false
			},
			comments: {
				type: String,
				required: false
			},
			predecessors: {
				type: Array,
				required: false
			},
			'predecessors.$': String,
			dependencies:{
				type: Array,
				required: false
			},
			'dependencies.$': String,


		}).validate({ projectId, title, type, pk_start, pk_end, length, date_start, date_end, duration, dep_date_start, dep_date_end, dep_duration, quantity, quantity_unit, rate, inverted, color, comments, predecessors, dependencies });

		return Tasks.insert({
			projectId,
			title,
			type,
			pk_start,
			pk_end,
			length,
			date_start,
			date_end,
			duration,
			dep_date_start,
			dep_date_end,
			dep_duration,
			quantity,
			quantity_unit,
			rate,
			inverted,
			color,
			comments,
			predecessors,
			dependencies,
			userId,
			username,
			projectId,
			createdAt: moment().valueOf(),
			updatedAt: moment().valueOf()
			})
	},
	// UPDATES A ENVOYER DE LA FORME : {projectId, title, pk_start...}

	'tasks.update'(_id, updates) {
		const task = Tasks.findOne({_id});
		if (task.userId !== this.userId) {
			throw new Meteor.Error('not-authorized')
		};

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			},
			projectId: {
				type: String,
				required: false,
				optional: true
			},
			title: {
				type: String,
				optional: true,
				max: 280
			},
			type: {
				type: String,
				max: 280,
				optional: true
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
			},
			dep_date_start: {
				type: Number,
				optional: true
			},
			dep_date_end: {
				type: Number,
				optional: true
			},
			dep_duration: {
				type: Number,
				optional: true
			},
			quantity: {
				type: Number,
				optional: true
			},
			quantity_unit: {
				type: String,
				optional: true
			},
			rate: {
				type: Number,
				optional: true
			},
			inverted: {
				type: Boolean,
				optional: true
			},
			color: {
				type: String,
				optional: true
			},
			comments: {
				type: String,
				optional: true
			},
			predecessors: {
				type: Array,
				optional: true
			},
			'predecessors.$': String,
			dependencies:{
				type: Array,
				optional: true
			},
			'dependencies.$': String
		}).validate({_id, ...updates });

		Tasks.update({
			_id,
			userId: this.userId
		}, {
			$set: {
				updatedAt: moment().valueOf(),
				...updates,
			}
		})
	},

	'tasks.remove'(_id) {
		const task = Tasks.findOne({_id});
		if (task.userId !== this.userId) {
			throw new Meteor.Error('not-authorized')
		};

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			}
		}).validate({ _id });

		Tasks.remove({
			_id,
			userId: this.userId
		})

		return _id;
	}
})