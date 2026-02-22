const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paymentService = require('../services/payment.service');

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const response = await paymentService.createCheckoutSession(req.user._id, orderId);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Stripe checkout session created'));
});

const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const event = paymentService.constructWebhookEvent(req.body, signature);

  await paymentService.handleStripeWebhookEvent(event);

  res.status(HTTP_STATUS.OK).json({ received: true });
});

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
};
