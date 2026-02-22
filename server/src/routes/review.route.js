const express = require('express');

const reviewController = require('../controllers/review.controller');
const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
} = require('../validations/review.validation');

const router = express.Router();

router.get(
  '/products/:id/reviews',
  validate(reviewQuerySchema, 'query'),
  reviewController.getProductReviews,
);

router.post(
  '/products/:id/reviews',
  protect,
  validate(createReviewSchema),
  reviewController.createReview,
);

router.put(
  '/reviews/:id',
  protect,
  validate(updateReviewSchema),
  reviewController.updateReview,
);

router.delete('/reviews/:id', protect, reviewController.deleteReview);

module.exports = router;
