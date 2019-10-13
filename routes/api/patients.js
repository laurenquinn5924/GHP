const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const Patient = require('../../models/Patient');

/*Working Route 10/9/19 LQH*/
//@route   POST api/patients
//@desc    Create or update a patient profile
//@access  Private, patient information
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
		if(firstName) patientFields.firstName = firstName;
		if(lastName) patientFields.lastName = lastName;
		if(dateOfBirth) patientFields.dateOfBirth = dateOfBirth;
		if(phoneNumber) patientFields.phoneNumber = phoneNumber;
		if(email) patientFields.email = email;
		if(medicalConditions) {
			patientFields.medicalConditions = medicalConditions.split(',').map(medicalCondition => medicalCondition.trim());
		}
		
		try {
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

/*Working Route 10/9/19 LQH*/
//@route   GET api/patients
//@desc    Get all patients
//@access  Private, patient information
router.get('/', auth, async (req,res) => {
	try {
		const patients = await Patient.find();
		res.json(patients)
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error in Get All Patients')
	}
});

/*Working Route 10/9/19 LQH*/
//@route   GET api/patients/:patient_id
//@desc    Get patient by ID
//@access  Private, patient information
router.get('/:patient_id', auth, async (req, res) => {
try {
	const patient = await Patient.findById(req.params.patient_id);

	if(!patient) {
		return res.status(400).json({ msg: "This patient does not exist." });
	}
	res.json(patient)
} 
catch (err) {
	console.error(err.message);
	if(err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Patient not found get patient by id, patient.js' })
		}
	res.json(500).send({ msg: 'Server Error in get patient by user ID' })
	}
});

//@route   DELETE api/patients/:_id
//@desc    Delete patient
//@access  Private, patient information
router.delete('/', auth, async (req,res) => {
	try {
		//Remove patient
		await Patient.findOneAndRemove(req.params.patient_id);
		//Return a message
		res.json({ msg: 'Patient deleted' })
	} 
	catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error in Delete Patient')
	}
});

//@route   PUT api/patients/:patient_id
//@desc    Update patient information
//@access  Private, patient information
router.put('/:patient_id', async (req,res) => {
	try {
		let patient = await Patient.findById(req.params.patient_id); 
		
		if(patient) {
			patient = await Patient.findOneAndUpdate(req.params.patient_id, 
				{ 
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					dateOfBirth: req.body.dateOfBirth,
					phoneNumber: req.body.phoneNumber,
					email: req.body.email,
					medicalConditions: req.body.medicalConditions 
				}
			);
			console.log(patient_id)
			return res.json(patient);	
		}
		// patient = await Patient.findOneAndUpdate(
		// 		{ patient: req.params.patient_id },
		// 		{ 
		// 			firstName: req.body.firstName,
		// 			lastName: req.body.lastName,
		// 			dateOfBirth: req.body.dateOfBirth,
		// 			phoneNumber: req.body.phoneNumber,
		// 			email: req.body.email,
		// 			medicalConditions: req.body.medicalConditions 
		// 		}
		// 		//,{ new: true }
		// 	)
	
			//Update
			
		//}	
		
	} 
	catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error in update patient info')
	}
});

module.exports = router;