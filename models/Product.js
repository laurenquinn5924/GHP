const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
	//Each product should be associaled with a patient
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'patient'
	},
	symptoms: {
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
		type: String
	},
	cbd: {
		type: String
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
		required: true
	}	
});

module.exports = Product = mongoose.model('product', ProductSchema);