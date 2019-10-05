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
	},
	product: [
		{
			symptom: {
				type: String
			},
			productName: {
				type: String,
				required: true
			},
			consumptionMethod: {
				type: String,
				required: true
			},
			brand: {
				type: String,
				required: true
			},
			thc: {
				type: String,
				required: true
			},
			cbd: {
				type: String,
				required: true
			},
			terpenes: {
				type: String
			},
			effects: {
				type: [String]
			},
			notes: {
				type: String
			},
			frequency: {
				type: String,
			}
		}
	]
});

module.exports = Patient = mongoose.model('patient', PatientSchema);