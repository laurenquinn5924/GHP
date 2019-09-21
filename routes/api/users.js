const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route  POST api/users
//@desc   Register User
//@access Public
router.post('/', 
[
	check('name', 'Name is required')
		.not()
		.isEmpty(),
	check('email', 'Please include a valid email address').isEmail(),
	check(
		'password', 'Please enter a password with 6 or more characters'
	).isLength({ min: 6 }),
], 
async (req, res) => {
	const errors = validationResult(req);
	//if there are errors
	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} 

	const { name, email, password } = req.body;

	//***** Anything that returns a promise need await in front of it
	try {
		let user = await User.findOne({ email });

		//See if user exists
		if(user) {
			return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
		}
		//Get users gravatar
		const avatar = gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm'
		})

		//Creates new instance of User, does not save to db
		user = new User({
			name,
			email,
			avatar,
			password
		});

		//Encrypt password w/ bcrypt
		const salt = await bcrypt.genSalt(10);

		user.password = await bcrypt.hash(password, salt);

		await user.save();

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