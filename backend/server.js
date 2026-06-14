require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      logger.info(`ShopSmart API listening on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server: %s', error.message)
    process.exit(1)
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

module.exports = app