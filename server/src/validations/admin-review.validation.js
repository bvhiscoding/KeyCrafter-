const Joi = require('joi');

const adminReviewQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50)
    .default(10),
  isApproved: Joi.boolean(),
  rating: Joi.number().integer().min(1).max(5),
  search: Joi.string().trim().allow(''),
});

module.exports = {
  adminReviewQuerySchema,
};
