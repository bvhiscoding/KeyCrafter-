const Joi = require('joi');

const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    name: Joi.string().trim().required().min(2).max(100),
    phone: Joi.string()
      .trim()
      .required()
      .pattern(/^\+?[0-9]{8,15}$/),
    address: Joi.string().trim().required().max(200),
    ward: Joi.string().trim().required().max(100),
    district: Joi.string().trim().required().max(100),
    city: Joi.string().trim().required().max(100),
  }).required(),
  paymentMethod: Joi.string().valid('stripe', 'cod', 'banking').required(),
  shippingFee: Joi.number().min(0).required().default(0),
  discount: Joi.number().min(0).default(0),
  note: Joi.string().trim().max(500).allow('', null),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
    .required(),

  note: Joi.string().trim().max(500).allow('', null),
});
const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid(
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ),
});
module.exports = {
  createOrderSchema,
  updateStatusSchema,
  orderQuerySchema,
};
