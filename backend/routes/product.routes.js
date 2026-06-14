const express = require('express')
const { body } = require('express-validator')
const { auth, admin } = require('../middleware/auth')
const {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/product.controller')

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post(
	'/',
	auth,
	admin,
	[
		body('name').trim().notEmpty().withMessage('Name is required'),
		body('price').isFloat({ min: 0 }).withMessage('Price must be a number greater than or equal to 0'),
		body('category').trim().notEmpty().withMessage('Category is required'),
		body('stock').isInt({ min: 0 }).withMessage('Stock must be an integer greater than or equal to 0'),
	],
	createProduct,
)
router.put('/:id', auth, admin, updateProduct)
router.delete('/:id', auth, admin, deleteProduct)

module.exports = router