const Joi = require('Joi');

const passwordRule = Joi
  .string()
  .min(8)
  .max(30)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .message({
    'string.pattern.base':
      'Password must include at least one lowercase letter, one uppercase letter, and one number',
  });
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50)
    .required(),
  email: Joi.string().trim().lowercase().email()
    .required(),
  password: passwordRule.required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email()
    .required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email()
    .required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required(),
  newPassword: passwordRule.required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().trim().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};
