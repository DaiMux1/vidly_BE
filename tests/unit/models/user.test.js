const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user')
const config = require('config');
const mongoose = require('mongoose');


describe('user.generateAuthToken', () => {
  it('token', () => {
    const payload = {  isAdmin: true }
    const user = new User(payload)
    const token = user.generateAuthToken()
    const decode = jwt.verify(token, config.get('jwtPrivateKey'))
    expect(decode).toMatchObject(payload)
  })
});
