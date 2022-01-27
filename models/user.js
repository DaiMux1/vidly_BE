const jwt = require('jsonwebtoken');
const config = require('config')
const Joi = require('joi');
const mongoose = require('mongoose');

const schemaUser = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024, // hash
  },
  isAdmin: Boolean
})

schemaUser.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin
  }, config.get('jwtPrivateKey'))
  return token
}

const User = mongoose.model('Users', schemaUser)

function validateRegister(register) {
  const schema = {
    name: Joi.string().min(5).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }

  return Joi.validate(register, schema)
}

module.exports.User = User
module.exports.validate = validateRegister