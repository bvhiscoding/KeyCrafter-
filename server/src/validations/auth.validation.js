const joi = require('joi');
const passwordRule = joi
  .string()
  .min(8)
  .max(30)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .message({
    'string.pattern.base':
      'Password must include at least one lowercase letter, one uppercase letter, and one number',
  });
const registerSchema = joi.object({
    name: joi.string().trim().min(2).max(50).required(),
    email: joi.string().trim().lowercase().email().required(),
    password: passwordRule.required(),
})

const loginSchema = joi.object({
    email: joi.string().trim().lowercase().email().required(),
    password: joi.string().required(),
})

const forgotPasswordSchema = joi.object({
    email: joi.string().trim().lowercase().email().required(),
})

const resetPasswordSchema = joi.object({
    token: joi.string().trim().required(),
    newPassword: passwordRule.required(),
})

const refreshTokenSchema = joi.object({
    refreshToken: joi.string().trim().required(),
})

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema,
}