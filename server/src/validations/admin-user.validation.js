const Joi = require('joi');

const adminUserQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50)
    .default(10),
  search: Joi.string().trim().allow(''),
  role: Joi.string().valid('user', 'admin'),
  isActive: Joi.boolean(),
});

const adminUpdateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

module.exports = {
  adminUserQuerySchema,
  adminUpdateUserStatusSchema,
};
