const mongoose = require('mongoose')
const logger = require('../utils/logger')

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    logger.info('MongoDB connected successfully')
    return mongoose.connection
  } catch (error) {
    logger.error('MongoDB connection failed: %s', error.message)
    throw error
  }
}

module.exports = connectDB