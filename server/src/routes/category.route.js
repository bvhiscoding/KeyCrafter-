const express = require('express');
const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validation.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const {
  createCategorySchema,
  updateCategorySchema,
  categoryListQuerySchema,
} = require('../validations/category.validation');

const router = express.Router();

router.get('/', validate(categoryListQuerySchema, 'query'), categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post(
  '/',
  protect,
  restrictTo('admin'),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete('/:id', protect, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;
