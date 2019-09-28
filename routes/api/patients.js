const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const Patient = require('../../models/Patient');
const User = require('../../models/User');


//@route   POST api/patients
//@desc    Create or update a patient profile
//@access  Private
router.post('/', [ auth,
	check('firstName', 'First Name is required')
		.not()
		.isEmpty(),
	check('lastName', 'Last name is required')
	.not()
	.isEmpty()
	], 
	async (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			firstName,
			lastName,
			dateOfBirth,
			phoneNumber,
			effects
		} = req.body

		//Build patient object
		const patientFields = {}
		patientFields.user = req.user.id;
		if(firstName) patientFields.firstName = firstName;
		if(lastName) patientFields.lastName = lastName;
		if(dateOfBirth) patientFields.dateOfBirth = dateOfBirth;
		if(phoneNumber) patientFields.phoneNumber = phoneNumber;
		if(effects) patientFields.effects = effects;
		console.log(req.body)

		res.send('Hello again')
	}
);

module.exports = router;