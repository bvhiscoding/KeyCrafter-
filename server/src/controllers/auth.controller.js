const HTTP_STATUS = require('../constants/httpStatus');
const { AUTH_MESSAGES } = require('../constants/messages');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const response = await authService.register(req.body);

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, AUTH_MESSAGES.REGISTER_SUCCESS));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.login(email, password);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, AUTH_MESSAGES.LOGIN_SUCCESS));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const response = await authService.refreshAccessToken(refreshToken);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, AUTH_MESSAGES.TOKEN_REFRESHED));
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, AUTH_MESSAGES.LOGOUT_SUCCESS));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const response = await authService.forgotPassword(email);

  const data = process.env.NODE_ENV === 'development' ? { resetToken: response.resetToken } : null;

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, data, AUTH_MESSAGES.FORGOT_PASSWORD_SENT));
});
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS));
});
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, user, AUTH_MESSAGES.GET_ME_SUCCESS));
});
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
