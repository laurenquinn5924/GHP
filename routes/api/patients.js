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
		.isEmpty(),
	check('medicalConditions', 'Medical Conditions are required')
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
			email,
			medicalConditions
		} = req.body

		//Build patient object
		const patientFields = {}
		patientFields.user = req.user.id;
		if(firstName) patientFields.firstName = firstName;
		if(lastName) patientFields.lastName = lastName;
		if(dateOfBirth) patientFields.dateOfBirth = dateOfBirth;
		if(phoneNumber) patientFields.phoneNumber = phoneNumber;
		if(email) patientFields.email = email;
		if(medicalConditions) {
			patientFields.medicalConditions = medicalConditions.split(',').map(medicalCondition => medicalCondition.trim());
		}
		
		try {
			let patient = await Patient.findOne({ user: req.user.id }) //req.user.id comes from the token
			if(patient) {
				//Update
				patient = await Patient.findOneAndUpdate( 
					{ user: req.user.id }, 
					{ $set: patientFields },
					{ new: true } 
				);
				return res.json(patient);
			}

			patient = new Patient(patientFields);

			await patient.save();
			res.json(patient)
		} 
		catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error in Create/Update Patient');
		}
	}
);

//@route   GET api/patients
//@desc    Get all profiles
//@access  Public
router.get('/', async (req,res) => {
	try {
		const patients = await Patient.find();
		res.json(patients)
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error in Get All Patients')
	}
});

//@route   GET api/patients
//@desc    Get all patients
//@access  Public
router.get('/', async (req,res) => {
	try {
		const patients = await Patient.find();
		res.json(patients)
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error in Get All Patients')
	}
});

//@route   GET api/patients/:_id
//@desc    Get patient by ID
//@access  Public
router.get('/:_id', async (req, res) => {
try {
	const patient = await Patient.findOne({ patient: req.params.id });

	if(!patient) {
		return res.status(400).json({ msg: "This patient does not exist." });
	}

	res.json(patient)
} 
catch (err) {
	console.error(err.message);
	if(err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found, profile.js' })
		}
	res.json(500).send({ msg: 'Server Error in get patient by user ID' })
	}
});

//@route   DELETE api/patients/:_id
//@desc    Delete patient
//@access  Private
router.delete('/:_id', auth, async (req,res) => {
	try {
		//Remove patient
		await Patient.findOneAndRemove({ patient: req.params.id });
		//Return a message
		res.json({ msg: 'Patient deleted' })
	} 
	catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error in Delete Patient')
	}
});

//@route   PUT api/patients/product
//@desc    Add product to patient profile
//@access  Private
router.put('/product', [
	auth,
		[ 
			check('productName', 'Must include name of product.')
				.not()
				.isEmpty(),
			check('brand', 'Must include brand or farm name.')
				.not()
				.isEmpty(),
			check('thc', 'List amount of THC.')
				.not()
				.isEmpty(),
			check('cbd', 'List amount of CBD')
				.not()
				.isEmpty(),
			check('consumptionMethod', 'Must include how cannabis is being comsumed')
				.not()
				.isEmpty()
		]
	],
	async (req,res) => {
		const errors = validationResult(req);
		if(!errors) {
			return res.status(400).json({ errors: errors.array });
		}

		const {
			symptom,
			productName,
			consumptionMethod,
			brand,
			thc,
			cbd,
			terpenes,
			effects,
			notes,
			frequency
		} = req.body;

		const newProduct = {
			symptom,
			productName,
			consumptionMethod,
			brand,
			thc,
			cbd,
			terpenes,
			effects,
			notes,
			frequency
		}

		try {
			const patient = await Patient.findOne({ patient: req.params.id });

			patient.product.unshift(newProduct);

			await patient.save();

			res.json(patient);
			
		} catch (err) {
			console.error(err.message)
			return res.status(500).send('Server Error add product')
		}

	}
)

module.exports = router;