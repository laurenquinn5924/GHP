const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	dateOfBirth: {
		type: Date
	},
	phoneNumber: {
		type: String
	},
	medicalConditions: {
		type: [String],
		required: true
	},
	notes: {
		type: String
	}
});

module.exports = Patient = mongoose.model('patient', PatientSchema);