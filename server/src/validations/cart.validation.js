const Joi = require('joi');

const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1),
});
const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});
const mergeGuestCartSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});
module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  mergeGuestCartSchema,
};
