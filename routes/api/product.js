const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Product = require('../../models/Product');
const Patient = require('../../models/Patient');

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