const Product = require('../models/Product')
const Review = require('../models/Review')
const { validationResult } = require('express-validator')

const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1)
    const category = req.query.category
    const search = req.query.search

    const filter = { isActive: { $ne: false } }

    if (category) {
      filter.category = category
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    const total = await Product.countDocuments(filter)

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    return res.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: { $ne: false } })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const reviews = await Review.find({ product: product._id }).populate(
      'user',
      'name email',
    )

    return res.json({
      success: true,
      data: {
        ...product.toObject(),
        reviews,
      },
    })
  } catch (error) {
    return next(error)
  }
}

const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      })
    }

    const { name, description, price, category, images, stock, avgRating, tags, isActive } = req.body

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      stock,
      avgRating,
      tags,
      isActive,
    })

    return res.status(201).json({
      success: true,
      data: product,
    })
  } catch (error) {
    return next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: { $ne: false } },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    return next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: { $ne: false } },
      { isActive: false },
      { new: true },
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}