const express = require('express');

const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const adminDashboardController = require('../../controllers/admin/dashboard.controller');
const {
  dashboardRevenueQuerySchema,
  dashboardTopProductsQuerySchema,
} = require('../../validations/admin-dashboard.validation');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/stats', adminDashboardController.getStats);
router.get('/revenue-chart', validate(dashboardRevenueQuerySchema, 'query'), adminDashboardController.getRevenueChart);
router.get('/top-products', validate(dashboardTopProductsQuerySchema, 'query'), adminDashboardController.getTopProducts);

module.exports = router;
