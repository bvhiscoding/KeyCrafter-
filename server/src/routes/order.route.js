const express = require('express');
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { createOrderSchema, orderQuerySchema } = require('../validations/order.validation');

const router = express.Router();
router.use(protect);
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', validate(orderQuerySchema, 'query'), orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);
module.exports = router;
