const express = require('express');
const blogController = require('../../controllers/blog.controller');
const validate = require('../../middlewares/validation.middleware');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const {
  createBlogSchema,
  importBlogsSchema,
  updateBlogSchema,
  adminBlogQuerySchema,
} = require('../../validations/blog.validation');

const router = express.Router();

// All admin blog routes require authentication + admin/staff role
router.use(protect, restrictTo('admin', 'staff'));

router.get('/', validate(adminBlogQuerySchema, 'query'), blogController.getAdminBlogs);
router.get('/:id', blogController.getAdminBlogById);
router.post('/', validate(createBlogSchema), blogController.createBlog);
router.post('/import', validate(importBlogsSchema), blogController.importBlogs);
router.put('/:id', validate(updateBlogSchema), blogController.updateBlog);
router.put('/:id/toggle-publish', blogController.togglePublish);
router.put('/:id/approve', blogController.approveBlog);
router.put('/:id/reject', blogController.rejectBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
