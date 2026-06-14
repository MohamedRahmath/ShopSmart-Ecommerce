const fs = require('fs')
const path = require('path')
const { createLogger, format, transports } = require('winston')

const logDir = path.join(__dirname, '..', 'logs')

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const loggerTransports = []

if (process.env.NODE_ENV === 'production') {
  loggerTransports.push(
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
    }),
  )
} else {
  loggerTransports.push(
    new transports.Console({
      level: 'info',
    }),
  )
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: loggerTransports,
})

module.exports = logger