const HTTP_STATUS = require('../constants/httpStatus');
const { COMMON_MESSAGES } = require('../constants/messages');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || COMMON_MESSAGES.INTERNAL_SERVER_ERROR;
  let details = err.details || null;
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = COMMON_MESSAGES.VALIDATION_FAILED;
    details = Object.values(err.errors).map((e) => e.message);
  }
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${duplicateField} already exists`;
  }
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid or expired token';
  }
  const response = {
    success: false,
    statusCode,
    message,
  };
  if (details) {
    response.details = details;
  }
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
