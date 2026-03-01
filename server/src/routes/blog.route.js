const express = require('express');
const blogController = require('../controllers/blog.controller');
const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  blogQuerySchema,
  myBlogQuerySchema,
  createUserBlogSchema,
  updateUserBlogSchema,
} = require('../validations/blog.validation');

const router = express.Router();

// Public routes
router.get('/', validate(blogQuerySchema, 'query'), blogController.getBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/categories', blogController.getCategoryStats);

// User blog submission routes (requires login)
router.get('/my-posts', protect, validate(myBlogQuerySchema, 'query'), blogController.getMyBlogs);
router.post('/my-posts', protect, validate(createUserBlogSchema), blogController.createUserBlog);
router.put('/my-posts/:id', protect, validate(updateUserBlogSchema), blogController.updateMyBlog);

router.get('/:slug', blogController.getBlogBySlug);

module.exports = router;
