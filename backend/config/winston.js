// www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications
// var appRoot = require('app-root-path')
var winston = require('winston')
require('winston-daily-rotate-file')
var fs = require('fs')
var path = require('path')
var Moment = require('moment-timezone')

const LOG_DIR = path.normalize(`${process.cwd()}/logs`)
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR)
}

var CurrentDate = Moment().tz('Asia/Jakarta').format('DD-MM/YYYY HH:mm:ss')

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    dirname: LOG_DIR,
    datePattern: 'YYYY-MM-DD',
    filename: '%DATE%.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: '14d',
    timestamp: CurrentDate,
    colorize: true

  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    timestamp: CurrentDate
  }
}

// your centralized logger object
const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message)
  }
}

module.exports = logger
