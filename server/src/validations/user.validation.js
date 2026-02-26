const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{8,15}$/)
    .messages({
      'string.pattern.base': 'Phone number must be between 8 and 15 digits',
    }),
  avatar: Joi.string().uri().allow(null, ''),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
}).messages({
  'any.only': 'confirmPassword must match newPassword',
});

const addressSchema = Joi.object({
  label: Joi.string().valid('home', 'work', 'other').required(),
  name: Joi.string().trim().min(2).max(50).required(),
  address: Joi.string().trim().max(200).required(),
  ward: Joi.string().trim().max(100).required(),
  district: Joi.string().trim().max(100).required(),
  city: Joi.string().trim().max(100).required(),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{8,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be between 8 and 15 digits',
    }),
  isDefault: Joi.boolean().default(false),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
};
