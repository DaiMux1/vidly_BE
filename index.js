const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/cors')(app);
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app)

// throw new Error('asdf')
// const p = Promise.reject(new Error("Something failed reject"))
// p.then(() => console.log('Done'))

// console.log(process.env.NODE_ENV)

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;