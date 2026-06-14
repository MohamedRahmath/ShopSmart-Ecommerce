const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const User = require('../models/User')

const createToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
})

const register = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: errors.array()[0].msg,
    })
  }

  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Email already in use',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  return res.status(201).json({
    success: true,
    token: createToken(user._id, user.role),
    user: sanitizeUser(user),
  })
}

const login = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: errors.array()[0].msg,
    })
  }

  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')

  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid credentials',
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid credentials',
    })
  }

  return res.json({
    success: true,
    token: createToken(user._id, user.role),
    user: sanitizeUser(user),
  })
}

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')

  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'User not found',
    })
  }

  return res.json({
    success: true,
    user,
  })
}

module.exports = {
  register,
  login,
  getProfile,
}