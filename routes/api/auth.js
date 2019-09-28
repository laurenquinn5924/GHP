const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); 
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route  GET api/auth
//@desc   T
//@access Public
router.get('/', auth, async (req, res) => {
	try {
		//Since this is a protcted route, and we used the token which has the user id, and in middleware req.user is set to the user in the token
		//We can simply pass in req.user. Don't want to return the password, use .select to leave off password
		const user = await User.findById(req.user.id).select('-password');
		res.json(user)
	} catch(err) {
		console.error(err.message)
		res.status(500).send('Server Error, auth.js');
	}
});

//@route   POST api/auth
//@desc    Authenticate user and get token
//@access  Public
router.post('/', 
[
	check('email', 'Please include a valid email address').isEmail(),
	
	//Not creating a password/checking string length, just checking if it exists
	check('password', 'Password is required').exists(),
], 
async (req, res) => {
	const errors = validationResult(req);
	//if there are errors
	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	} 

	const { email, password } = req.body;

	//***** Anything that returns a promise needs await in front of it
	//Check for the user, if not want to send back an error
	try {
		let user = await User.findOne({ email });

		//See if user exists
		if(!user) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Invalid credentials, user does not exist' }] });
		}

		//takes plain text password and encrypted password and compares them
		//password = plain text password entered by user
		const isMatch = await bcrypt.compare(password, user.password);
		
		//If password is not a match, want to show invalid credentials
		if(!isMatch) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Invalid credentials, password invalid' }] });
		}

		//Return json webtoken
		const payload = {
			user: {
				id: user.id
			}
		}

		jwt.sign(
			//Pass in payloas
			payload, 
			//Pass in secret
			config.get('jwtSecret'),
			//set expiration of user token 
			{ expiresIn: 360000 },
			(err, token) => {
				if(err) throw err;
				res.json({ token });
			}
		);

	} catch(err) {
		console.error(err.message)
		res.status(500).send('Server Error users.js');
	}
});

module.exports = router;

//Note: For production, take out qualifier on Invalid credentials.