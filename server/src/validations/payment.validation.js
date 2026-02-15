const Joi = require('joi');
const createCheckoutSessionSchema = Joi.object({
    orderId : Joi.string().required()
})
module.exports = {
    createCheckoutSessionSchema
};