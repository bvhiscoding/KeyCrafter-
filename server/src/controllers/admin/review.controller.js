const HTTP_STATUS = require('../../constants/httpStatus');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const adminReviewService = require('../../services/admin-review.service');

const getAllReviews = asyncHandler(async (req, res) => {
  const response = await adminReviewService.getAllReviews(req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched admin reviews'));
});

const approveReview = asyncHandler(async (req, res) => {
  const response = await adminReviewService.approveReview(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Review approved'));
});

const deleteReview = asyncHandler(async (req, res) => {
  const response = await adminReviewService.deleteReview(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Review deleted'));
});

module.exports = {
  getAllReviews,
  approveReview,
  deleteReview,
};
