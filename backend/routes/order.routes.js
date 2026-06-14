const express = require('express')
const { body } = require('express-validator')
const { auth, admin } = require('../middleware/auth')
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/order.controller')

const router = express.Router()

router.post('/', auth, createOrder)
router.get('/my', auth, getMyOrders)
router.put(
	'/:id/status',
	auth,
	admin,
	[body('status').isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid order status')],
	updateOrderStatus,
)

module.exports = router