const { validationResult } = require('express-validator');
const { sendError }        = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(
      res,
      'Validation failed',
      400,
      errors.array().map(e => ({ field: e.path, message: e.msg }))
    );
    return;
  }
  next();
};

module.exports = { validate };