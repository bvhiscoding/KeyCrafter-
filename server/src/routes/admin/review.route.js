const express = require('express');

const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const adminReviewController = require('../../controllers/admin/review.controller');
const { adminReviewQuerySchema } = require('../../validations/admin-review.validation');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/', validate(adminReviewQuerySchema, 'query'), adminReviewController.getAllReviews);
router.put('/:id/approve', adminReviewController.approveReview);
router.delete('/:id', adminReviewController.deleteReview);

module.exports = router;
