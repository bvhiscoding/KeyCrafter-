const express = require('express');

const adminProductRoutes = require('./product.route');
const adminCategoryRoutes = require('./category.route');
const adminBrandRoutes = require('./brand.route');
const adminOrderRoutes = require('./order.route');
const adminUserRoutes = require('./user.route');
const adminReviewRoutes = require('./review.route');
const adminDashboardRoutes = require('./dashboard.route');
const adminBlogRoutes = require('./blog.route');

const router = express.Router();

router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/brands', adminBrandRoutes);
router.use('/orders', adminOrderRoutes);
router.use('/users', adminUserRoutes);
router.use('/reviews', adminReviewRoutes);
router.use('/dashboard', adminDashboardRoutes);
router.use('/blogs', adminBlogRoutes);

module.exports = router;
