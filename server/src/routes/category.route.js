const express = require('express');

const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validation.middleware');
const { categoryListQuerySchema } = require('../validations/category.validation');

const router = express.Router();

router.get('/', validate(categoryListQuerySchema, 'query'), categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

module.exports = router;
