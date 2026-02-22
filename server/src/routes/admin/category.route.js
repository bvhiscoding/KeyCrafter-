const express = require('express');

const categoryController = require('../../controllers/admin/category.controller');
const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const {
  createCategorySchema,
  updateCategorySchema,
  categoryListQuerySchema,
} = require('../../validations/category.validation');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/', validate(categoryListQuerySchema, 'query'), categoryController.getAllCategories);
router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
