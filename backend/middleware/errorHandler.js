const logger = require('../utils/logger')

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500

  logger.error(error.stack || error.message || 'Internal Server Error')

  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    response.stack = error.stack
  }

  return res.status(statusCode).json(response)
}

module.exports = errorHandler