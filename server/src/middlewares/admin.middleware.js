const HTTP_STATUS = require('../constants/httpStatus');
const { AUTH_MESSAGES } = require('../constants/messages');
const ApiError = require('../utils/ApiError');

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN);
  }

  next();
};

module.exports = {
  requireAdmin,
};
