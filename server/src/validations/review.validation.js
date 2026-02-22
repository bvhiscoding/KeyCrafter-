const Joi = require('joi');

const createReviewSchema = Joi.object({
  orderId: Joi.string().trim().required(),
  rating: Joi.number().integer().min(1).max(5)
    .required(),
  comment: Joi.string().trim().min(10).max(1000)
    .required(),
  images: Joi.array().items(Joi.string().uri()).max(5).default([]),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().trim().min(10).max(1000),
  images: Joi.array().items(Joi.string().uri()).max(5),
}).min(1);

const reviewQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50)
    .default(10),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
};
