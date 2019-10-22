const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route  GET api/profile/me
//@desc   Get current user's profile
//@access Private
router.get('/me', auth, async (req, res) => {
	try {
		//user refers to "user" in Profile model which is attached to the user id which is passed in with the token
		//Also want to show avatar and name, which are found in the User model not the Profile model. Use .populate to also pull this info from the User model
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

		//if no profile
		if(!profile) {
			return res.status(400).json({ msg: 'No profile exists for this user' })
		}

		res.json(profile)
	}
	catch(err) {
		console.error(err.message);
		res.status(500).send('Server Error at Get Current User Profile')
	}
});

//@route   POST api/profile
//@desc    Create or update a user profile
//@access  Private
//Need auth and validation middleware, send in route as an array of middleware
router.post('/', 
	[ 
		auth, 
		[
			check('status', 'Status is required')
				.not()
				.isEmpty(),
			check('skills', 'Skills are required')
				.not()
				.isEmpty()
		]
	], 
	async (req,res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { 
			company, 
			website, 
			location, 
			bio, 
			status, 
			githubusername, 
			skills, 
			youtube, 
			facebook, 
			twitter, 
			instagram, 
			linkedin
		} = req.body

		//Build profile object
		const profileFields = {}
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map(skill => skill.trim()); //Splits the string at the ',' then maps to an array, accounts for any blank space
		}

		//Build social object
		profileFields.social = {}
		if(youtube) profileFields.social.youtube = youtube;
		if(twitter) profileFields.social.twitter = twitter;
		if(facebook) profileFields.social.facebook = facebook;
		if(linkedin) profileFields.social.linkedin = linkedin;
		if(instagram) profileFields.social.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id }) //req.user.id comes from the token

			if(profile) {//If profile exists, update profile
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id }, 
					{ $set: profileFields }, 
					{ new: true }
				);
			
				return res.json(profile)
			}

			//Create new profile
			profile = new Profile(profileFields);

			await profile.save();
			res.json(profile)
		}
		catch(err) {
			console.error(err.message);
			res.status(500).send('Server Error in Create Profile');
		}
	}
);

//@route   GET api/profile
//@desc    Get all profiles
//@access  Public
router.get('/', async (req,res) => {
	try{
		//Get all the profiles from the Profile model, also need name and avatar from User model
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		//res.json to send the profiles along
		res.json(profiles)
	}
	catch(err) {
		console.error(err.message)
		res.status(500).send('Server Error, Get all profiles')
	}
});

//@route   GET api/profile/user/:user_id
//@desc    Get profile by user ID
//@access  Public
router.get('/user/:user_id', async (req,res) => {
	try{
		//Get all the profiles from the Profile model, also need name and avatar from User model
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

		//Check if user has a registered profile
		if(!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}
		//res.json to send the profiles along
		res.json(profile)
	}
	catch(err) {
		console.error(err.message)
		if(err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found, profile.js' })
		}
		res.status(500).send('Server Error, Get all profiles')
	}
});

//@route   DELETE api/profile
//@desc    Delete profile, user & posts
//@access  Private
router.delete('/', auth, async (req,res) => {
	try{
		//@todo- remove user posts
		//Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		//Remove user
		await User.findOneAndRemove({ _id: req.user.id} );
		//Return a message
		res.json({ msg: 'User and Profile deleted'})
	}
	catch(err) {
		console.error(err.message)
		res.status(500).send('Server Error, Delete profile and user')
	}
});

//@route   PUT api/profile/experience
//@desc    Add profile experience
//@access  Private
router.put('/experience', [
	auth, 
	//In React front end, this will be a form with required fields. Need validations.
	[
		check('title', 'Job title is required')
			.not()
			.isEmpty(),
		check('company', 'Company name is required')
			.not()
			.isEmpty(),
		check('from', 'Job start date is required')
			.not()
			.isEmpty(),
	]
], 
async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	
	const {
		title,
		company,
		location,
		from,
		to,
		current,
		description
	} = req.body;

	//Will create an object with the data submitted by the user
	const newExp = {
		title,
		company,
		location,
		from,
		to,
		current,
		description
	}

	try {
		const profile = await Profile.findOne({ user: req.user.id });
		//sends back an array of experience, .unshift puts experience at the beginning rather than at the end like .push would do
		profile.experience.unshift(newExp);

		await profile.save();

		res.json(profile)
	} 
	catch (err) {
		console.error(err.message)
		return res.status(500).send('Server Error add profile experience');
	}
});

//@route   DELETE api/profile/experience/:exp_id
//@desc    Delete experience from profile
//@access  Private
router.delete('/experience/:exp_id', auth, async (req,res) => {
	try {
		//Get profile of logged in user
		const profile = await Profile.findOne({ user: req.user.id});

		//Get remove index
		const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);

		//Saving profile with removed experience
		await profile.save();
		//Sending back profile as res
		res.json(profile)
	} 
	catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error delete experience');
	}
});

//@route   PUT api/profile/education
//@desc    Add profile education
//@access  Private
router.put('/education', [
	auth, 
	//In React front end, this will be a form with required fields. Need validations.
	[
		check('school', 'School is required')
			.not()
			.isEmpty(),
		check('degree', 'Degree is required')
			.not()
			.isEmpty(),
		check('fieldofstudy', 'Field of study is required')
			.not()
			.isEmpty(),
		check('from', 'Start date is required')
			.not()
			.isEmpty(),
	]
], 
async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	
	const {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description
	} = req.body;

	//Will create an object with the data submitted by the user
	const newEdu = {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description
	}

	try {
		const profile = await Profile.findOne({ user: req.user.id });
		//sends back an array of experience, .unshift puts experience at the beginning rather than at the end like .push would do
		profile.education.unshift(newEdu);

		await profile.save();

		res.json(profile)
	} 
	catch (err) {
		console.error(err.message)
		return res.status(500).send('Server Error add profile experience');
	}
});

//@route   DELETE api/profile/education/:edu_id
//@desc    Delete education from profile
//@access  Private
router.delete('/education/:edu_id', auth, async (req,res) => {
	try {
		//Get profile of logged in user
		const profile = await Profile.findOne({ user: req.user.id});

		//Get remove index
		const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

		profile.education.splice(removeIndex, 1);

		//Saving profile with removed experience
		await profile.save();
		//Sending back profile as res
		res.json(profile)
	} 
	catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error delete education');
	}
});


module.exports = router;