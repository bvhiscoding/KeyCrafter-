const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().max(1000).allow('', null),
  shortDescription: Joi.string().trim().max(300).allow('', null),
  price: Joi.number().min(0).required(),
  salePrice: Joi.number().min(0).allow(null),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  thumbnail: Joi.string().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim().lowercase()).default([]),
  isFeatured: Joi.boolean().default(false),
  isNew: Joi.boolean().default(true),
  isActive: Joi.boolean().default(true),
  specs: Joi.object().default({}),
});
const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(200),
  description: Joi.string().trim().max(1000),
  shortDescription: Joi.string().trim().max(300).allow('', null),
  price: Joi.number().min(0),
  salePrice: Joi.number().min(0).allow(null),
  stock: Joi.number().integer().min(0),
  category: Joi.string(),
  brand: Joi.string(),
  images: Joi.array().items(Joi.string().uri()),
  thumbnail: Joi.string().uri(),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  isFeatured: Joi.boolean(),
  isNew: Joi.boolean(),
  isActive: Joi.boolean(),
  specs: Joi.object(),
}).min(1); // At least one field must be provided for update
const productListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  search: Joi.string().trim().allow(''),
  category: Joi.string().trim(),
  brand: Joi.string().trim(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  sort: Joi.string()
    .valid('newest', 'price_asc', 'price_desc', 'rating_desc', 'best_selling')
    .default('newest'),
});
module.exports = {
  createProductSchema,
  updateProductSchema,
  productListQuerySchema,
};
