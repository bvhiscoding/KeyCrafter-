const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('./email.service');
const User = require('../models/user.model');
const HTTP_STATUS = require('../constants/httpStatus');
const { AUTH_MESSAGES } = require('../constants/messages');
const ApiError = require('../utils/ApiError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require('../utils/generateToken');

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  delete user.refreshToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

const register = async (userData) => {
  const userExists = await User.findOne({ email: userData.email });

  if (userExists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  const user = await User.create(userData);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
  user.refreshToken = hashedRefreshToken;
  await user.save({ validateBeforeSave: false });
  try {
    await emailService.sendWelcomeEmail({ email: user.email, name: user.name });
  } catch (error) {
    // ignore email error to avoid breaking register flow
  }
  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email, isActive: true }).select('+password +refreshToken');

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
  user.refreshToken = hashedRefreshToken;
  await user.save({ validateBeforeSave: false });
  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  let decoded;

  try {
    decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || !user.isActive || !user.refreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
  }
  const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
  }
  const accessToken = generateAccessToken(user._id);
  return { accessToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    return { resetToken: null };
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  try {
    await emailService.sendForgotPasswordEmail({
      email: user.email,
      name: user.name,
      resetLink,
      expiresMinutes: 15,
    });
  } catch (error) {
    // ignore email error to avoid breaking forgot-password flow
  }
  return { resetToken };
};

const resetPassword = async (token, newPassword) => {
  const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: Date.now() },
    isActive: true,
  }).select('+password +refreshToken');

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, AUTH_MESSAGES.RESET_TOKEN_INVALID);
  }
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  user.refreshToken = undefined;
  await user.save();
  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 12);
  user.refreshToken = hashedRefreshToken;
  await user.save({ validateBeforeSave: false });
  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
  }
  return sanitizeUser(user);
};
module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
