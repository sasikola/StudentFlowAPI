require('dotenv').config();

const ENV = {
  PORT:           process.env.PORT           || '5000',
  MONGODB_URI:    process.env.MONGODB_URI    || 'mongodb://localhost:27017/studentflow',
  JWT_SECRET:     process.env.JWT_SECRET     || 'studentflow_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV:       process.env.NODE_ENV       || 'development',
};

module.exports = { ENV };