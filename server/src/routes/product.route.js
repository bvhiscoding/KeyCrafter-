const express = require('express');
const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validation.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const {
  createProductSchema,
  updateProductSchema,
  productListQuerySchema,
} = require('../validations/product.validation');
const router = express.Router();
router.get('/', validate(productListQuerySchema, 'query'), productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validate(createProductSchema),
  productController.createProduct
);
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);
module.exports = router;
