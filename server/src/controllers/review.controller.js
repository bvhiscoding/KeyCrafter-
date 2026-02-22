const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const reviewService = require('../services/review.service');

const createReview = asyncHandler(async (req, res) => {
  const response = await reviewService.createReview(req.user._id, req.params.id, req.body);

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Review created'));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const response = await reviewService.getProductReviews(req.params.id, req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched product reviews'));
});

const updateReview = asyncHandler(async (req, res) => {
  const response = await reviewService.updateReview(req.params.id, req.user._id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Review updated'));
});

const deleteReview = asyncHandler(async (req, res) => {
  const response = await reviewService.deleteReview(req.params.id, req.user._id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Review deleted'));
});

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
