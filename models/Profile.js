const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	//Every profile should be associated with a user
	user: {
		type: mongoose.Schema.Types.ObjectId,
		//Add reference to the model being used
		ref: 'user'
	},
	company: {
		type: String,
	},
	website: {
		type: String
	},
	location: {
		type: String
	},
	//Status = career development=> jr, sr, mid-level
	status: {
		type: String,
		required: true
	},
	skills: {
		type: [String],
		required: true
	},
	bio: {
		type: String
	},
	githubusername: {
		type: String
	},
	experience: [
		{
			title: {
				type: String,
				required: true
			},
			company: {
				type: String,
				required: true
			},
			location: {
				type: String
			},
			from: {
				type: Date,
				required: true
			},
			to: {
				type: Date
			},
			//If user currently works at a company, this will make the "worked there to" date = current => checkbox
			current: {
				type: Boolean,
				default: false
			},
			description: {
				type: String
			}
		}
	],
	education: [
		{
			school: {
				type: String,
				required: true
			},
			degree: {
				type: String,
				required: true
			},
			fieldofstudy: {
				type: String,
				required: true
			},
			from: {
				type: String,
				required: true
			},
			to: {
				type: Date
			},
			//If user currently attends this school, this will make the degree completion date = current => checkbox
			current: {
				type: Boolean,
				default: false
			},
			description: {
				type: String
			}
		}
	], 
	social: {
		youtube: {
			type: String
		},
		twitter: {
			type: String
		},
		facebook: {
			type: String
		},
		linkedin: {
			type: String
		},
		instagram: {
			type: String
		},
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);