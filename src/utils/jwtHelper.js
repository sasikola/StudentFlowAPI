const jwt    = require('jsonwebtoken');
const { ENV } = require('../config/env');

const generateToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };