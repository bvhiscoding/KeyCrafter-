const express = require('express');
const blogController = require('../controllers/blog.controller');
const validate = require('../middlewares/validation.middleware');
const { blogQuerySchema } = require('../validations/blog.validation');

const router = express.Router();

// Public routes
router.get('/', validate(blogQuerySchema, 'query'), blogController.getBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/categories', blogController.getCategoryStats);
router.get('/:slug', blogController.getBlogBySlug);

module.exports = router;
