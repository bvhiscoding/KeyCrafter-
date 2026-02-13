const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(500).allow('', null),
  icon: Joi.string().trim().max(100).allow('', null),
  image: Joi.string().uri().trim().allow('', null),
  order: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
});

const updateCategorySchema = Joi
  .object({
    name: Joi.string().trim().max(100),
    description: Joi.string().trim().max(500).allow('', null),
    icon: Joi.string().trim().max(100).allow('', null),
    image: Joi.string().uri().allow('', null),
    order: Joi.number().integer().min(0),
    isActive: Joi.boolean(),
  })
  .min(1); // At least one field must be provided for update

const categoryListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50)
    .default(10),
  search: Joi.string().trim().allow(''),
  isActive: Joi.boolean(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryListQuerySchema,
};
