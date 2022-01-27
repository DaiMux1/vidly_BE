const { User } = require("../../../models/user");
const auth = require('../../../middleware/auth');
const mongoose = require("mongoose");

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    
    const user_ = new User(user);
    const token = user_.generateAuthToken();
    // console.log(token)
    const req = {
      header: jest.fn().mockReturnValue(token)
    }

    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    // console.log(req.user);
    // console.log(user);
    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user);
  })
});
