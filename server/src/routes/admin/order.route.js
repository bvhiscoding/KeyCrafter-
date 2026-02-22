const express = require('express');

const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const adminOrderController = require('../../controllers/admin/order.controller');
const {
  adminOrderQuerySchema,
  adminUpdateOrderStatusSchema,
} = require('../../validations/admin-order.validation');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/', validate(adminOrderQuerySchema, 'query'), adminOrderController.getAllOrders);
router.get('/:id', adminOrderController.getOrderById);
router.put('/:id/status', validate(adminUpdateOrderStatusSchema), adminOrderController.updateOrderStatus);

module.exports = router;
