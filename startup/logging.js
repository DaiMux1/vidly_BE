const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  // process.on('uncaughtException', (ex) => {
  //   winston.error(ex.message, ex)
  //   // process.exit(1)
  // })
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  )

  process.on('unhandledRejection', (ex) => {
    // logger.error(ex.message, ex)
    // setTimeout(() => {
    //   process.exit(1)
    // }, 1000);
    throw ex
  })

  winston.add(winston.transports.File, { filename: 'logfile.log' })
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/vidly"
  // })
}