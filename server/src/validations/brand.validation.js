const Joi = require('joi');

const createBrandSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  logo: Joi.string().uri().trim().allow('', null).optional(),
  description: Joi.string().trim().max(500).allow('', null),
  country: Joi.string().trim().max(100).allow('', null),
  website: Joi.string().uri().allow('', null),
  isActive: Joi.boolean().default(true),
});
const updateBrandSchema = Joi.object({
  name: Joi.string().trim().max(100),
  logo: Joi.string().uri().allow('', null),
  description: Joi.string().trim().max(500).allow('', null),
  country: Joi.string().trim().max(100).allow('', null),
  website: Joi.string().uri().allow('', null),
  isActive: Joi.boolean(),
}).min(1); // At least one field must be provided for update

const brandListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().trim().allow(''),
  isActive: Joi.boolean(),
});

module.exports = {
  createBrandSchema,
  updateBrandSchema,
  brandListQuerySchema,
};
