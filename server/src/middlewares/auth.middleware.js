const User = require('../models/user.model');
const HTTP_STATUS = require('../constants/httpStatus');
const { AUTH_MESSAGES } = require('../constants/messages');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/generateToken');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }
  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
  }
  let decoded;
  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN);
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.USER_NOT_FOUND);
  }
  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.USER_INACTIVE);
  }
  req.user = user;
  next();
});

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN);
  }
  next();
};
module.exports = { protect, restrictTo };
