require('dotenv').config()
const config = require('config');

module.exports = function () {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('Need jwtPrivateKey')
    console.error('Need jwtPrivateKey')
    process.exit(1)
  }
}