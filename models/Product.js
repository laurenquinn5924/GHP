const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
	//Each product should be associaled with a patient
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'patient'
	},
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
});

module.exports = Product = mongoose.model('product', ProductSchema);