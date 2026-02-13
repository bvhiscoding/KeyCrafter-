const express = require('express');
const brandController = require('../controllers/brand.controller');
const validate = require('../middlewares/validation.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const {
  createBrandSchema,
  updateBrandSchema,
  brandListQuerySchema,
} = require('../validations/brand.validation');
const router = express.Router();
router.get('/', validate(brandListQuerySchema, 'query'), brandController.getAllBrands);
router.get('/:slug', brandController.getBrandBySlug);
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validate(createBrandSchema),
  brandController.createBrand
);
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(updateBrandSchema),
  brandController.updateBrand
);
router.delete('/:id', protect, restrictTo('admin'), brandController.deleteBrand);
module.exports = router;
