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
	dateOfBirth: {
		type: Date
	},
	phoneNumber: {
		type: String
	},
	product: [
		{
			symptom: {
				type: String
			},
			productName: {
				type: String
			},
			brand: {
				type: String
			},
			productProperties: [
				{
					thc: {
						type: Number
					},
					cbd: {
						type: Number
					},
					terpenes: {
						type: String
					}
				}
			],
			effects: {
				type: String
			}
		}
	]
});

module.exports = Patient = mongoose.model('patient', PatientSchema);