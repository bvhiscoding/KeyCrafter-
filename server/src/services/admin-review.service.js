const Review = require('../models/review.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

const getAllReviews = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.isApproved !== undefined) {
    filter.isApproved = query.isApproved;
  }

  if (query.rating !== undefined) {
    filter.rating = Number(query.rating);
  }

  if (query.search) {
    filter.comment = { $regex: query.search, $options: 'i' };
  }

  const [items, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name email')
      .populate('product', 'name slug thumbnail')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const approveReview = async (id) => {
  const review = await Review.findByIdAndUpdate(
    id,
    { isApproved: true },
    { returnDocument: 'after' },
  );

  if (!review) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Review not found');
  }

  await Review.calcAverageRatings(review.product);
  return review;
};

const deleteReview = async (id) => {
  const review = await Review.findOneAndDelete({ _id: id });

  if (!review) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Review not found');
  }

  return review;
};

module.exports = {
  getAllReviews,
  approveReview,
  deleteReview,
};
