const winston = require('winston');

module.exports = function (err, req, res, next) {
  winston.warn(err.message, err)

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send('Something error')
}