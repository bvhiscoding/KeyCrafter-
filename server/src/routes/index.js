const express = require('express');
const authRoutes = require('./auth.route');
const categoryRoutes = require('./category.route');
const brandRoutes = require('./brand.route');
const productRoutes = require('./product.route');
const cartRoutes = require('./cart.route');
const orderRoutes = require('./order.route');
const paymentRoutes = require('./payment.route');
const reviewRoutes = require('./review.route');
const userRoutes = require('./user.route');
const blogRoutes = require('./blog.route');
const adminRoutes = require('./admin');
const uploadRoutes = require('./upload.route');

const router = express.Router();
router.use('/', reviewRoutes);
router.use('/', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
