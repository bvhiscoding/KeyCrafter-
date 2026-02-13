const express = require('express');
const authRoutes = require('./auth.route');
const categoryRoutes = require('./category.route');
const brandRoutes = require('./brand.route');
const productRoutes = require('./product.route');
const cartRoutes = require('./cart.route');
const orderRoutes = require('./order.route');

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
module.exports = router;
