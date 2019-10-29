const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Product = require('../../models/Product');
const Patient = require('../../models/Patient');

/*Working Route 10/21/19 LQH */
//@route   POST api/product
//@desc    Create or update product on patient profile
//@access  Private
router.post('/', [
	auth,
		[ 
			check('productName', 'Must include name of product.')
				.not()
				.isEmpty(),
			check('brand', 'Must include brand or farm name.')
				.not()
				.isEmpty(),
			check('consumptionMethod', 'Must include how cannabis is being consumed')
				.not()
				.isEmpty(),
			check('frequency', 'How often is this product used by the patient?')
				.not()
				.isEmpty()
		]
	],
	async (req,res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			symptoms,
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

		const productFields = {}
		productFields.patient = req.body.patient_id;
		if (productName) productFields.productName = productName;
		if (consumptionMethod) productFields.consumptionMethod = consumptionMethod;
		if (brand) productFields.brand = brand;
		if (thc) productFields.thc = thc;
		if (cbd) productFields.cbd = cbd;
		if (terpenes) productFields.terpenes = terpenes;
		if (notes) productFields.notes = notes;
		if (frequency) productFields.frequency = frequency;
		if (effects) {
			productFields.effects = effects.split(',').map(effect => effect.trim());
		}
		if (symptoms) {
			productFields.symptoms = symptoms.split(',').map(symptom => symptom.trim());
		}
		
		try {
			product = new Product(productFields);
			await product.save();
			res.json(product)
		}
		catch(err) {
			console.error(err.message);
			res.status(500).send('Server Error in Create product');
		}
	}
);

/*Working Route 10/21/19 LQH */
//@route   GET api/product
//@desc    Get all products
//@access  Private
router.get('/', auth, async(req,res) => {
	try {
		const products = await Product.find();
		res.json(products)
	}
	catch(err) {
		console.error(err.message);
		res.status(500).send('Server Error in Get All Products')
	}
});

/*Working Route 10/21/19 LQH */
//@route   GET api/product/patient/:patient_id
//@desc    Get all products attached to Patient ID
//@access  Private
router.get('/patient/:patient_id', auth, async (req,res) => {
	try {
		const product = await Product.find({ patient: req.params.patient_id }).populate('patient');

		if(!product) {
			return res.status(400).json({ msg: 'There are not any products associated with this user' });
		}
		res.json(product)
	}
	catch(err) {
		console.error(err.message);
		if(err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Patient not found' });
		}
		return res.status(500).send('Server Error Get Products by Patient ID');
	}
});

/*Working Route 10/21/19 LQH */
//@route   DELETE api/product/:product_id
//@desc    Delete Product
//@access  Private
router.delete('/:product_id', async (req,res) => {
	try {
		let product = await Product.findByIdAndDelete(req.params.product_id, req.body);
		if(!product) {
			return res.status(400).json({ msg: 'This product does not exist.' })
		}
		
		res.json({ msg: 'Product Deleted.' })
	} 
	catch (err) {
		console.error(err.message)
		return res.status(500).send('Server Error in Delete Product')
	}
});

//@route   PUT api/product/:product_id
//@desc    Update Product
//@access  Private
router.put('/:product_id', auth, async (req,res) => {
	

	try {
		let product = await Product.findByIdAndUpdate(
			req.params.product_id,
			{ $set: req.body },
			{ new: true }
			
		);

		if(!product) {
			return res.status(400).json({ msg: 'This product does not exist' })
		}
		await product.save();
		return res.json(product)
	} 
	catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error in Update Product')
	}
});

module.exports = router;