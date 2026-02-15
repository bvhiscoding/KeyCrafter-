const express = require('express');
const paymentController = require('../controllers/payment.controller');
const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { createCheckoutSessionSchema } = require('../validations/payment.validation');

const router = express.Router();

router.post(
  '/stripe/create-session',
  protect,
  validate(createCheckoutSessionSchema),
  paymentController.createCheckoutSession
);
module.exports = router;
