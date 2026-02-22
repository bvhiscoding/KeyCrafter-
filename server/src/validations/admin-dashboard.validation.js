const Joi = require('joi');

const dashboardRevenueQuerySchema = Joi.object({
  period: Joi.string().valid('7d', '30d', '90d', '365d').default('30d'),
});

const dashboardTopProductsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(20)
    .default(5),
});

module.exports = {
  dashboardRevenueQuerySchema,
  dashboardTopProductsQuerySchema,
};
