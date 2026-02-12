const AUTH_MESSAGES = Object.freeze({
  REGISTER_SUCCESS: 'Register successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Access token refreshed',
  FORGOT_PASSWORD_SENT: 'If that email exists, password reset instructions have been generated',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  GET_ME_SUCCESS: 'Fetched current user successfully',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Not authorized',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  USER_NOT_FOUND: 'User not found',
  USER_INACTIVE: 'User is inactive',
  FORBIDDEN: 'You do not have permission to access this resource',
  RESET_TOKEN_INVALID: 'Reset token is invalid or expired',
});
const COMMON_MESSAGES = Object.freeze({
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  RESOURCE_NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
});
module.exports = {
  AUTH_MESSAGES,
  COMMON_MESSAGES,
};
