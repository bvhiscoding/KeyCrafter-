const Joi = require('joi');

const adminProductListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50)
    .default(12),
  search: Joi.string().trim().allow(''),
  category: Joi.string().trim(),
  brand: Joi.string().trim(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  sort: Joi.string()
    .valid('newest', 'price_asc', 'price_desc', 'rating_desc', 'best_selling')
    .default('newest'),
  isActive: Joi.boolean(),
  isDeleted: Joi.boolean(),
});

const adminProductUploadSchema = Joi.object({
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  thumbnail: Joi.string().uri().allow('', null),
});

module.exports = {
  adminProductListQuerySchema,
  adminProductUploadSchema,
};
