const Order = require('../models/Order')
const Product = require('../models/Product')
const { validationResult } = require('express-validator')

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required',
      })
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      })
    }

    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product || item.productId)

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        })
      }

      totalAmount += product.price * item.quantity

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      })

      product.stock -= item.quantity
      await product.save()
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    })

    return res.status(201).json({
      success: true,
      order,
    })
  } catch (error) {
    return next(error)
  }
}

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price images')

    return res.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    return next(error)
  }
}

const updateOrderStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    return res.json({
      success: true,
      order,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
}