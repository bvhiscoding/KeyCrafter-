const Joi = require('joi');

const adminOrderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50)
    .default(10),
  status: Joi.string().valid(
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded'),
  search: Joi.string().trim().allow(''),
});

const adminUpdateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ).required(),
  note: Joi.string().trim().max(500).allow('', null),
});

module.exports = {
  adminOrderQuerySchema,
  adminUpdateOrderStatusSchema,
};
